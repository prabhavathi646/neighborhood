from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, HelpRequest
from schemas import UserCreate, UserLogin, Token, HelpRequestCreate, HelpRequestOut
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = "your_super_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI(title="Neighborhood Help Network API")

# Create DB tables
Base.metadata.create_all(bind=engine)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get current user from token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Root
@app.get("/")
def root():
    return {"message": "Neighborhood Help Network API is running"}

# Register
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password[:72])
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        location=user.location
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully", "user_id": db_user.id}

# Login
@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not pwd_context.verify(form_data.password[:72], db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": db_user.email, "exp": expire}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

# Create Help Request
@app.post("/requests", response_model=HelpRequestOut)
def create_request(request: HelpRequestCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_request = HelpRequest(
        title=request.title,
        description=request.description,
        location=request.location,
        user_id=current_user.id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

# Get all Help Requests
@app.get("/requests", response_model=list[HelpRequestOut])
def get_requests(db: Session = Depends(get_db)):
    return db.query(HelpRequest).all()



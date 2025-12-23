from pydantic import BaseModel, EmailStr
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    location: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Help request schemas
class HelpRequestCreate(BaseModel):
    title: str
    description: str
    location: str

class HelpRequestOut(BaseModel):
    id: int
    title: str
    description: str
    location: str
    created_at: datetime
    user_id: int

    model_config = {
        "from_attributes": True  # <--- Pydantic V2 change
    }



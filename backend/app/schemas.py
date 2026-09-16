from pydantic import BaseModel, EmailStr

# What the frontend sends when registering
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# What the frontend sends when logging in
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# What we send back (never include password_hash!)
class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

# What we send back after successful login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
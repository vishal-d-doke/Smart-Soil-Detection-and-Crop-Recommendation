from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

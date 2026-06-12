# api.py — Oliver

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

from services.parser import parse_excel
from services.normalizer import normalizar

router = APIRouter()

#Endpoint
@router.post("/upload")
async def upload_excel(
    file: UploadFile = File(...)
):

    df = parse_excel(file.file)

    df = normalizar(df)

    return {
        "columnas": list(df.columns),
        "registros": len(df)
    }
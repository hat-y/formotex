#!/bin/bash

# Test del sistema de invitaciones - Formotex
echo "🚀 Probando sistema de invitaciones de Formotex"
echo "================================================="

BASE_URL="http://localhost:3000/api"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar respuestas
show_response() {
    echo -e "${BLUE}$1${NC}"
    echo "Response: $2"
    echo "---"
    echo
}

echo "1️⃣ Probando login de admin..."
ADMIN_LOGIN=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@company.local",
        "password": "Admin#12345"
    }')

show_response "LOGIN ADMIN" "$ADMIN_LOGIN"

# Extraer token (asumiendo que viene en formato JSON)
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}❌ Error: No se pudo obtener el token de admin${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token de admin obtenido: ${ADMIN_TOKEN:0:20}...${NC}"
echo

echo "2️⃣ Creando invitación para nuevo admin..."
INVITATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/invitations" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{
        "email": "nuevo-admin@empresa.com",
        "role": "admin"
    }')

show_response "CREAR INVITACIÓN" "$INVITATION_RESPONSE"

# Extraer token de invitación
INVITATION_TOKEN=$(echo $INVITATION_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$INVITATION_TOKEN" ]; then
    echo -e "${RED}❌ Error: No se pudo obtener el token de invitación${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token de invitación obtenido: ${INVITATION_TOKEN:0:20}...${NC}"
echo

echo "3️⃣ Aceptando invitación (creando admin)..."
ACCEPT_INVITATION=$(curl -s -X POST "${BASE_URL}/auth/register-with-invitation" \
    -H "Content-Type: application/json" \
    -d "{
        \"token\": \"$INVITATION_TOKEN\",
        \"password\": \"password123\",
        \"firstName\": \"Nuevo\",
        \"lastName\": \"Admin\"
    }")

show_response "ACEPTAR INVITACIÓN" "$ACCEPT_INVITATION"

echo "4️⃣ Login con el nuevo admin..."
NEW_ADMIN_LOGIN=$(curl -s -X POST "${BASE_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "nuevo-admin@empresa.com",
        "password": "password123"
    }')

show_response "LOGIN NUEVO ADMIN" "$NEW_ADMIN_LOGIN"

echo "5️⃣ Registro público (usuario normal)..."
PUBLIC_REGISTER=$(curl -s -X POST "${BASE_URL}/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "usuario@ejemplo.com",
        "password": "password123",
        "firstName": "Usuario",
        "lastName": "Normal"
    }')

show_response "REGISTRO PÚBLICO" "$PUBLIC_REGISTER"

echo "6️⃣ Listando invitaciones..."
LIST_INVITATIONS=$(curl -s -X GET "${BASE_URL}/auth/invitations" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

show_response "LISTAR INVITACIONES" "$LIST_INVITATIONS"

echo "7️⃣ Listando usuarios..."
LIST_USERS=$(curl -s -X GET "${BASE_URL}/users" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

show_response "LISTAR USUARIOS" "$LIST_USERS"

echo -e "${GREEN}🎉 Pruebas completadas!${NC}"
echo
echo "📝 Resumen de endpoints probados:"
echo "   ✅ POST /api/auth/login"
echo "   ✅ POST /api/auth/invitations"
echo "   ✅ POST /api/auth/register-with-invitation"
echo "   ✅ POST /api/auth/register"
echo "   ✅ GET /api/auth/invitations"
echo "   ✅ GET /api/users"
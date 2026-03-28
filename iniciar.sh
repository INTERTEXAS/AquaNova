CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; RESET='\033[0m'
echo -e "\n${CYAN}${BOLD}  ╔═══════════════════════════════════════╗\n  ║       🧺  AQUANOVA — Iniciando       ║\n  ╚═══════════════════════════════════════╝${RESET}\n"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
echo -e "${YELLOW}🔍 Verificando puertos...${RESET}"
for PORT in 3000 5173; do
  PID=$(lsof -ti:$PORT 2>/dev/null)
  if [ -n "$PID" ]; then kill -9 $PID 2>/dev/null; echo -e "${GREEN}✅ Puerto $PORT liberado${RESET}"; else echo -e "${GREEN}✅ Puerto $PORT disponible${RESET}"; fi
done
if [ ! -d "node_modules" ] || [ ! -d "node_modules/express" ]; then
  echo -e "\n${YELLOW}📦 Instalando dependencias...${RESET}"
  npm install
  echo -e "${GREEN}✅ Dependencias instaladas${RESET}"
else
  echo -e "\n${GREEN}✅ Dependencias ya instaladas${RESET}"
fi
if ! command -v slim &> /dev/null; then
  echo -e "\n${YELLOW}📥 Instalando slim.sh...${RESET}"
  curl -sL https://slim.sh/install.sh | sh
fi
echo -e "\n${YELLOW}🚀 Iniciando servidor backend...${RESET}"
node server.js > /tmp/aquanova-server.log 2>&1 &
SERVER_PID=$!
sleep 2
if curl -s http://localhost:3000/api/clientes > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Backend corriendo · PostgreSQL conectado${RESET}"
else
  echo -e "${RED}⚠️  Verifica tu contraseña en server.js${RESET}"
fi
echo -e "\n${YELLOW}⚛️  Iniciando React + Vite...${RESET}"
npm run dev > /tmp/aquanova-react.log 2>&1 &
REACT_PID=$!
echo -e "${YELLOW}⏳ Esperando que Vite compile...${RESET}"
sleep 4
open http://localhost:5173
echo -e "${GREEN}✅ Navegador abierto en http://localhost:5173${RESET}"
echo -e "\n${YELLOW}🌍 Creando URL pública con slim.sh...${RESET}"
slim share --port 5173 --subdomain aquanova > /tmp/aquanova-slim.log 2>&1 &
SLIM_PID=$!
sleep 3
echo -e "\n${CYAN}${BOLD}  ╔══════════════════════════════════════════════════╗\n  ║          ✅  AQUANOVA CORRIENDO                  ║\n  ╠══════════════════════════════════════════════════╣\n  ║  💻  Local:   http://localhost:5173              ║\n  ║  🔌  API:     http://localhost:3000              ║\n  ║  🌍  Público: https://aquanova.slim.show         ║\n  ╠══════════════════════════════════════════════════╣\n  ║   📲  Comparte el link público con tu clase      ║\n  ║   Ctrl+C para detener todo                       ║\n  ╚══════════════════════════════════════════════════╝${RESET}\n"
trap "echo -e '\n${RED}🛑 Deteniendo Aquanova...${RESET}'; kill $SERVER_PID $REACT_PID $SLIM_PID 2>/dev/null; echo -e '${GREEN}✅ Todo detenido.${RESET}'; exit 0" SIGINT SIGTERM
echo -e "${YELLOW}📋 Logs del servidor (Ctrl+C para detener):${RESET}\n"
tail -f /tmp/aquanova-server.log &
wait $REACT_PID

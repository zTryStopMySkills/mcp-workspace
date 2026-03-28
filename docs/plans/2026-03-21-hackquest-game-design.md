# HackQuest — Diseño del Juego

## Concepto
Videojuego web educativo de ciberseguridad competitivo. Jugadores compiten resolviendo retos de hacking ético en tiempo real. Aprenden técnicas reales de pentesting mientras juegan.

---

## Stack Tecnológico

- **Frontend:** Next.js 15, React, Tailwind CSS, xterm.js (terminal en navegador), Socket.IO client
- **Backend:** Node.js, Express, Socket.IO, JWT auth
- **BBDD:** PostgreSQL (datos) + Redis (sesiones, matchmaking, estado partidas)
- **Sandboxes:** Docker containers con entornos vulnerables preconfigurados (mini-redes con Docker Compose)
- **Deploy:** VPS con Docker Compose (desarrollo), escalable a Kubernetes

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (Web)                     │
│  Next.js + xterm.js + Mapa de Red interactivo       │
│  Visor de tráfico (.pcap) + Editor de reportes      │
│  WebSockets tiempo real                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│                 SERVIDOR (Backend)                    │
│  Node.js + Express + Socket.IO                       │
│  Matchmaking Engine + Game State Manager             │
│  Sandbox Orchestrator (gestiona mini-redes)          │
│  Log Collector (acciones del jugador)                │
└───────┬──────────┬──────────┬───────────────────────┘
        │          │          │
        ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌─────────────────────┐
│ Postgres │ │  Redis   │ │   Docker Compose     │
│ Datos    │ │ Sesiones │ │   por partida:       │
│ Rankings │ │ Estado   │ │   - Web server       │
│ Reportes │ │ Matchmk. │ │   - BBDD vulnerable  │
│ CVEs     │ │          │ │   - Firewall/Router  │
└──────────┘ └──────────┘ │   - Traffic gen.     │
                          │   - Herramientas     │
                          └─────────────────────┘
```

### Capas de realismo
- Mini-redes Docker Compose por reto (web + BBDD + firewall + víctima)
- Herramientas reales: Nmap, SQLMap, Hydra, John the Ripper, Gobuster, Netcat, tshark
- Tráfico de red falso realista (.pcap)
- Fases de pentest real: Reconocimiento → Escaneo → Enumeración → Explotación → Post-explotación → Reporte
- Escenarios basados en CVEs reales (Log4Shell, EternalBlue, Heartbleed...)
- Blue Team: defender, encontrar backdoors, parchear
- Logs forenses de todas las acciones del jugador

---

## Plataforma
- Web (navegador) con terminal integrada (xterm.js)
- Estética: Hacker clásico (verde neón, terminal) + Militar/Espionaje (dossiers, mapas de red, briefings clasificados)

---

## Modos de Juego

### Modo 1: Carrera (tiempo real)
- 2-5 jugadores, mismo reto, tiempo límite
- Barra de progreso de rivales visible
- Primer jugador en resolver gana bonus

### Modo 2: Por turnos
- Cada jugador tiene turno con tiempo límite
- Los demás ven su terminal en directo
- Chat en vivo
- Pausa: 1 vez por partida (2min extra)

### Modo 3: Campaña solo
- Historia narrativa por capítulos (misiones de agencia)
- 4-5 retos encadenados por capítulo
- Ranking global asíncrono
- 3 dificultades: Difícil, Medio, Experto

### Modo 4: Red vs Blue (desbloquea en rango Red Team)
- 1v1 o equipos: atacantes vs defensores
- Se alternan roles entre rondas (5 rondas)
- El modo más avanzado y realista

---

## Dificultades de Campaña

### Difícil (aprendizaje guiado)
- Ayudas visuales siempre activas
- 3 primeros intentos sin ayuda
- A partir del intento 3: textos de ayuda/tips sobre el paso donde estás atascado
- Botón [SIGUIENTE TIP] ilimitado (uno a uno, progresivos)
- Tips nunca dan la flag ni el comando exacto
- Fallo total: reinicia fase, NUNCA se muestra la respuesta

### Medio (equilibrado)
- Sin ayudas visuales constantes
- 3 consejos máximo por fase (el jugador decide cuándo)
- Si lleva +5 intentos fallidos: UNA ayuda visual sutil
- Fallo total: reinicia fase, NUNCA se muestra la respuesta

### Experto (sin piedad)
- Sin ayudas, sin consejos, sin tips, NADA
- CON tiempo límite (igual que online)
- Mismo proceso end-to-end
- Fallo total: reinicia fase
- **Logro exclusivo: HACKER** (banner + rol de perfil)

---

## Sistema de detección de bloqueo
- Tiempo en paso actual vs tiempo promedio (x2 = posible atasco)
- Comandos repetidos sin avance (3+ veces)
- Comandos sin relación con el objetivo
- Inactividad prolongada (2+ min sin escribir)

---

## Árbol de Habilidades (5 ramas)

| Rama | Retos ejemplo (fácil → difícil) |
|---|---|
| Web Hacking | XSS reflejado → SQLi Union → SSRF → Deserialización → RCE encadenado |
| Redes | Escaneo Nmap → Sniffing ARP → MITM → Pivoting → Explotación protocolos |
| Criptografía | Caesar cipher → Base64 stacking → RSA débil → Padding Oracle → Crypto CVEs |
| Forense | Análisis logs → Inspección .pcap → Stego imágenes → Memory dump → Incident response |
| Sistemas | Permisos Linux → SUID exploit → Escalada privilegios → Persistencia → Full chain |

---

## Rangos Globales

| Rango | Puntos | Desbloqueo |
|---|---|---|
| Script Kiddie | 0-500 | Puzzles básicos |
| Junior | 500-1.500 | Modo por turnos |
| Pentester | 1.500-4.000 | Sandboxes reales |
| Red Team | 4.000-8.000 | Red vs Blue |
| Elite Hacker | 8.000-15.000 | CVEs reales + mini-redes |
| Legend | 15.000+ | Crear retos propios |

---

## Sistema de Puntuación con Penalización Progresiva

| Rango | Ganas al resolver | 1º puesto bonus | Pierdes al fallar | Pierdes timeout | Ratio |
|---|---|---|---|---|---|
| Script Kiddie | 100 | +50 | 0 | 0 | Zona segura |
| Junior | 90 | +40 | -15 | -8 | 6:1 |
| Pentester | 80 | +35 | -40 | -20 | 2:1 |
| Red Team | 70 | +30 | -70 | -35 | 1:1 |
| Elite Hacker | 60 | +25 | -110 | -55 | 1:1.8 |
| Legend | 50 | +20 | -150 | -80 | 1:3 |

- No puedes bajar de rango (suelo)
- Racha de fallos (3 seguidos): penalización x1.5
- Racha de aciertos (3 seguidos): bonus x1.5
- Reto perfecto (sin fallos): x2 puntos
- Mini-reporte de calidad: +30 pts fijos
- Primer reto del día: +15 pts bonus

---

## Sistema ELO (racha dinámica)

ELO base: 1000. Modifica puntos con multiplicador.

| ELO | Estado | Multi. ganancia | Multi. pérdida |
|---|---|---|---|
| 600-700 | TILTED | x0.6 | x1.4 |
| 700-800 | COLD | x0.7 | x1.2 |
| 800-900 | COOLING | x0.85 | x1.1 |
| 900-1100 | STABLE | x1.0 | x1.0 |
| 1100-1200 | WARMING | x1.15 | x0.9 |
| 1200-1350 | HOT | x1.3 | x0.8 |
| 1350-1500 | ON FIRE | x1.5 | x0.7 |

- Victoria: +50 ELO | Derrota: -60 ELO | Reto perfecto: +80 ELO
- ELO mínimo: 400 | máximo: 1500
- Decay: sin jugar 3 días → -30 ELO/día hacia 1000
- Reset al subir de rango

---

## Tiempos por Complejidad

| Dificultad | Tiempo estimado real | Tiempo dado | Margen |
|---|---|---|---|
| Trivial | 2-3 min | 5 min | +60% |
| Fácil | 5-8 min | 12 min | +50% |
| Medio | 10-15 min | 25 min | +65% |
| Difícil | 20-30 min | 45 min | +50% |
| Experto | 40-60 min | 90 min | +50% |
| Legendario | 1-2 horas | 3 horas | +50% |

### Bonus velocidad
- < 25% tiempo: LIGHTNING x2.0
- < 50% tiempo: FAST x1.5
- < 75% tiempo: GOOD x1.2
- < 100% tiempo: CLEAR x1.0
- > 100% (campaña): OVERTIME -10%/10%

---

## Sistema de Pistas

| Pista | Coste | Qué da |
|---|---|---|
| Pista 1 | -10% puntos | Dirección general |
| Pista 2 | -25% puntos | Más específica |
| Pista 3 | -50% puntos | Máximo 38% de la respuesta, nunca la flag |

---

## Pokédex de Técnicas

120 técnicas totales (25 por rama, 20 en Sistemas)
70 puzzles simulados + 50 sandboxes reales

Cada ficha contiene:
- Qué es la técnica
- Cómo la explotaste (tu timeline)
- Impacto real (casos históricos)
- Cómo defenderse
- CVEs relacionados
- Tu rendimiento personal

---

## Briefing/Debriefing por misión
- Briefing: contexto narrativo estilo agencia, objetivo, fases requeridas
- Debriefing: lo que hiciste, timeline, por qué funcionó, impacto real, ficha desbloqueada

---

## Logros por Completar Campaña

| Modo | Rol perfil | Banner | Borde avatar |
|---|---|---|---|
| Difícil | SECURITY | Código binario estático, azul | Azul |
| Medio | SECURITY | Código scrolleando, cyan | Plateado |
| Experto | HACKER | Lluvia Matrix animada, verde neón, glitch | Dorado |
| Experto + Legend | HACKER | Lluvia dorada + partículas | Dorado brillante |
| Experto + 100% retos | THE ONE | Lluvia roja Matrix | Rojo + pulso |

### Banner HACKER
- Lluvia de caracteres katakana + binario cayendo
- Texto HACKER en ASCII art con glitch cada 5-8s
- Líneas de código que se teclean en tiempo real
- Frases aleatorias: "access_granted", "firewall_bypassed", "GHOST_MODE"

### Banner SECURITY
- Código binario/scrolleando según modo
- Texto SECURITY en ASCII art
- Estilo más sobrio y profesional

---

## Monetización
- **Freemium**: gratis niveles básicos, pago para sandboxes reales, retos avanzados, cosméticos
- **Código tester**: `4l0p3c1411%` desbloquea todo el contenido completo

---

## Matchmaking
- Automático por rango
- Empareja jugadores de nivel similar

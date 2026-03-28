---
name: HackQuest Game
description: Videojuego web educativo de ciberseguridad competitivo — diseño completo, stack, mecánicas, pendiente de implementación
type: project
---

Proyecto HackQuest: juego web competitivo de hacking ético educativo.

**Estado:** Diseño completo, pendiente de implementación.

**Stack:** Next.js 15 + Node.js/Express + Socket.IO + PostgreSQL + Redis + Docker (sandboxes) + xterm.js (terminal)

**Estética:** Hacker clásico (verde neón) + Militar/Espionaje (dossiers, briefings clasificados)

**Mecánicas clave:**
- 4 modos: Carrera, Por turnos, Campaña (3 dificultades), Red vs Blue
- 5 ramas: Web Hacking, Redes, Criptografía, Forense, Sistemas
- 6 rangos: Script Kiddie → Legend
- Sistema ELO con multiplicadores por racha
- Puntuación progresiva: más rango = más pierdes al fallar, más ganas al acertar
- Pokédex de 120 técnicas con fichas educativas
- Briefing/Debriefing narrativo por misión
- Sandboxes Docker reales con mini-redes, herramientas reales, tráfico .pcap
- Logros: SECURITY (campaña Difícil/Medio), HACKER (Experto), THE ONE (Experto+100%)
- Banner HACKER estilo Matrix animado
- Código tester: 4l0p3c1411%

**Why:** El usuario quiere crear un juego que enseñe ciberseguridad de forma divertida y competitiva.

**How to apply:** El documento de diseño completo está en docs/plans/2026-03-21-hackquest-game-design.md. Consultar siempre antes de implementar.

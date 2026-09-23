# -*- coding: utf-8 -*-
import io, os

OUT = os.path.dirname(__file__)

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:9.5mm 12mm}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Poppins',system-ui,Arial,sans-serif;font-size:8.4pt;line-height:1.45;color:#1e1e1e}
.name{font-family:'Space Grotesk','Poppins',sans-serif;font-weight:700;font-size:18pt;letter-spacing:.4px;text-transform:uppercase;color:#141414;line-height:1}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.subtitle{color:#e0402f;font-weight:500;font-size:8.8pt;margin-top:5px;max-width:80%;line-height:1.35}
.contact{font-size:7.9pt;color:#3a3a3a;text-align:right;white-space:nowrap;line-height:1.65}
.contact b{color:#141414}
.rule{height:2.2px;background:#e0402f;border:none;margin:8px 0 9px}
.intro{font-size:8.2pt;color:#333;text-align:justify;line-height:1.45}
.cols{display:flex;gap:22px;margin-top:9px}
.left{width:35%}
.right{width:65%}
.sec{margin-bottom:11px}
.left .sec:last-child,.right .sec:last-child{margin-bottom:0}
.sec h2{font-size:8.6pt;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#e0402f;padding-bottom:4px;border-bottom:1px solid #e5e5e5;margin-bottom:7px}
ul{list-style:none}
li{position:relative;padding-left:11px;margin-bottom:4px;font-size:8.2pt;color:#2c2c2c;line-height:1.4}
li:last-child{margin-bottom:0}
li::before{content:"";position:absolute;left:0;top:5px;width:3px;height:3px;border-radius:50%;background:#e0402f}
.entry{margin-bottom:9px;page-break-inside:avoid}
.entry:last-child{margin-bottom:0}
.entry .role{font-weight:600;font-size:8.8pt;color:#141414}
.entry .org{color:#7a7a7a;font-size:7.9pt;margin-top:1px}
.entry .date{color:#e0402f;font-size:7.7pt;font-weight:500;margin-top:1px}
.entry .note{color:#555;font-size:7.9pt;margin-top:2px}
.entry ul{margin-top:4px}
.foot{margin-top:7px;padding-top:5px;border-top:1px solid #eee;text-align:center;color:#9a9a9a;font-size:7.1pt}
"""

def esc(s):
    return (s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;"))

def li_list(items):
    return "<ul>" + "".join("<li>%s</li>" % esc(x) for x in items) + "</ul>"

def entry(role, org, date, note, bullets):
    h = '<div class="entry"><div class="role">%s</div><div class="org">%s</div><div class="date">%s</div>' % (esc(role), esc(org), esc(date))
    if note:
        h += '<div class="note">%s</div>' % esc(note)
    if bullets:
        h += li_list(bullets)
    h += "</div>"
    return h

def build(D):
    left = ""
    left += '<div class="sec"><h2>%s</h2>%s</div>' % (D["skills_h"], li_list(D["skills"]))
    left += '<div class="sec"><h2>%s</h2>%s</div>' % (D["lang_h"], li_list(D["langs"]))
    left += '<div class="sec"><h2>%s</h2>%s</div>' % (D["soft_h"], li_list(D["soft"]))
    left += '<div class="sec"><h2>%s</h2>%s</div>' % (D["engage_h"], li_list(D["engage"]))
    left += '<div class="sec"><h2>%s</h2>%s</div>' % (D["interests_h"], li_list(D["interests"]))

    right = '<div class="sec"><h2>%s</h2>%s</div>' % (
        D["exp_h"], "".join(entry(*e) for e in D["exp"]))
    right += '<div class="sec"><h2>%s</h2>%s</div>' % (
        D["edu_h"], "".join(entry(*e) for e in D["edu"]))

    return """<!DOCTYPE html><html lang="%s"><head><meta charset="UTF-8"><style>%s</style></head><body>
<div class="head">
  <div>
    <div class="name">Olga Sangupamba Nika</div>
    <div class="subtitle">%s</div>
  </div>
  <div class="contact"><b>%s</b>&nbsp; olgasangupambanika@gmail.com<br><b>%s</b>&nbsp; 06 12 40 59 39<br><b>%s</b>&nbsp; %s</div>
</div>
<hr class="rule">
<p class="intro">%s</p>
<div class="cols"><div class="left">%s</div><div class="right">%s</div></div>
<div class="foot">olgasangupambanika@gmail.com &middot; 06 12 40 59 39 &middot; %s</div>
</body></html>""" % (D["lang"], CSS, esc(D["subtitle"]), D["c_email"], D["c_phone"], D["c_loc"], esc(D["loc"]), esc(D["intro"]), left, right, esc(D["loc"]))


FR = {
 "lang":"fr",
 "loc":"Montbéliard, France",
 "subtitle":"Développeuse Full-Stack & UX/UI · Étudiante en Master 2 Nouvelles Technologies de l'Information et de la Communication",
 "c_email":"Email","c_phone":"Tél.","c_loc":"Lieu",
 "intro":"Je conçois et développe des applications web et mobiles de bout en bout : back-end, front-end, base de données et interface utilisateur. La recherche appliquée est au cœur de ma pratique : comprendre un besoin utilisateur par l'observation et les entretiens, prototyper, tester, itérer et documenter chaque étape de la démarche. Cette approche a déjà été mise en œuvre lors de mon stage de recherche UX/UI. Je reste ouverte à des projets de conception de solutions numériques, en entreprise comme en laboratoire de recherche.",
 "skills_h":"Compétences",
 "skills":["Full-Stack : React, Node.js, FastAPI, Python","Mobile : KivyMD, Flutter","Bases de données : PostgreSQL, SQLite, Redis","UI/UX : Figma, prototypage, accessibilité (RGAA)","Recherche : UX Research et recherche appliquée en général, design thinking","Gestion de projet digital","Création graphique, montage vidéo"],
 "lang_h":"Langues",
 "langs":["Français — langue maternelle","Anglais — B2"],
 "soft_h":"Savoir-être",
 "soft":["Autonomie & organisation","Travail en équipe & communication","Curiosité & créativité","Rigueur & sens de l'analyse"],
 "engage_h":"Engagements",
 "engage":["Formation continue en gestion de projet, Project Management Institute (PMI RDC)","Bénévole, UNICEF France"],
 "interests_h":"Centres d'intérêt",
 "interests":["Montage vidéo & création de contenus visuels","Photographie","Relations humaines"],
 "exp_h":"Expériences",
 "exp":[
  ("Stagiaire chercheuse UX/UI Design","Université Catholique du Congo","2025","",
   ["Conduite d'études utilisateurs (entretiens, tests d'utilisabilité) pour améliorer l'expérience d'outils numériques universitaires",
    "Prototypage d'interfaces sur Figma et itération des maquettes à partir des retours utilisateurs",
    "Contribution à un projet de recherche appliquée en interaction homme-machine et documentation de la méthodologie suivie"]),
  ("Stagiaire informatique","Société Nationale d'Électricité (SNEL RDC)","2024","",
   ["Participation au déploiement de solutions numériques et au support technique de premier niveau",
    "Analyse des incidents courants, rédaction de supports techniques et veille technologique"]),
  ("Stagiaire enseignante en informatique","Classe de Terminale","2024","",
   ["Animation de séances d'initiation à l'informatique auprès d'élèves de Terminale",
    "Conception de supports pédagogiques et explication de notions techniques de façon claire"]),
  ("Chargée de communication","Project Management Institute (PMI RDC)","2023 – 2025","",
   ["Conception de supports visuels et promotionnels en mobilisant design graphique et sens du message",
    "Organisation de conférences et coordination logistique d'événements, de la préparation à la mise en œuvre",
    "Pilotage de la communication interne et externe : contenus clairs et adaptés à différents publics",
    "Suivi et analyse des performances des actions de communication, propositions d'amélioration"]),
 ],
 "edu_h":"Formations",
 "edu":[
  ("Master 2 NTIC, parcours Produits & Services Multimédia","Université de Franche-Comté, Montbéliard","2025 – 2027","Développement mobile, scénarisation multimédia, design interactif",[]),
  ("Master Administration Réseaux","Université Catholique du Congo","2023 – 2025","Gestion de projet, Internet des objets, administration des réseaux",[]),
  ("Licence en Informatique","Université Catholique du Congo","2021 – 2023","Développement web, systèmes d'information, cybersécurité",[]),
 ],
}

EN = {
 "lang":"en",
 "loc":"Montbéliard, France",
 "subtitle":"Full-Stack Developer & UX/UI Designer · Master's student in New Information & Communication Technologies",
 "c_email":"Email","c_phone":"Phone","c_loc":"Location",
 "intro":"I design and develop web and mobile applications end to end: back-end, front-end, database and user interface. Applied research is at the heart of my practice: understanding a user need through observation and interviews, prototyping, testing, iterating and documenting every step of the process. I already put this approach into practice during my UX/UI research internship. I remain open to projects designing digital solutions, in companies as well as in research labs.",
 "skills_h":"Skills",
 "skills":["Full-Stack: React, Node.js, FastAPI, Python","Mobile: KivyMD, Flutter","Databases: PostgreSQL, SQLite, Redis","UI/UX: Figma, prototyping, accessibility (WCAG)","Research: UX Research and applied research in general, design thinking","Digital project management","Graphic design, video editing"],
 "lang_h":"Languages",
 "langs":["French — native","English — B2"],
 "soft_h":"Soft skills",
 "soft":["Autonomy & organization","Teamwork & communication","Curiosity & creativity","Rigor & analytical mindset"],
 "engage_h":"Involvement",
 "engage":["Continuing education in project management, Project Management Institute (PMI RDC)","Volunteer, UNICEF France"],
 "interests_h":"Interests",
 "interests":["Video editing & visual content creation","Photography","Working with people"],
 "exp_h":"Experience",
 "exp":[
  ("UX/UI Design Research Intern","Université Catholique du Congo","2025","",
   ["Conducting user studies (interviews, usability testing) to improve the experience of university digital tools",
    "Prototyping interfaces in Figma and iterating on mockups based on user feedback",
    "Contribution to an applied research project in human-computer interaction, and documentation of the methodology used"]),
  ("IT Intern","Société Nationale d'Électricité (SNEL RDC)","2024","",
   ["Involvement in deploying digital solutions and first-level technical support",
    "Analysis of common incidents, writing technical documentation and technology watch"]),
  ("Computer Science Teaching Intern","Final-year high-school class (Terminale)","2024","",
   ["Leading introductory computing sessions for final-year students",
    "Designing teaching materials and explaining technical concepts clearly"]),
  ("Communications Officer","Project Management Institute (PMI RDC)","2023 – 2025","",
   ["Designing visual and promotional materials through graphic design and clear messaging",
    "Organizing conferences and coordinating event logistics, from preparation to delivery",
    "Managing internal and external communications: clear content tailored to different audiences",
    "Monitoring and analyzing communication performance, and proposing improvements"]),
 ],
 "edu_h":"Education",
 "edu":[
  ("Master 2 NICT — Multimedia Products & Services track","Université de Franche-Comté, Montbéliard","2025 – 2027","Mobile development, multimedia storytelling, interactive design",[]),
  ("Master's in Network Administration","Université Catholique du Congo","2023 – 2025","Project management, Internet of Things, network administration",[]),
  ("Bachelor's in Computer Science","Université Catholique du Congo","2021 – 2023","Web development, information systems, cybersecurity",[]),
 ],
}

ES = {
 "lang":"es",
 "loc":"Montbéliard, Francia",
 "subtitle":"Desarrolladora Full-Stack y diseñadora UX/UI · Estudiante de Máster 2 en Nuevas Tecnologías de la Información y la Comunicación",
 "c_email":"Correo","c_phone":"Tel.","c_loc":"Ubicación",
 "intro":"Diseño y desarrollo aplicaciones web y móviles de principio a fin: back-end, front-end, base de datos e interfaz de usuario. La investigación aplicada está en el centro de mi práctica: entender una necesidad del usuario mediante la observación y las entrevistas, prototipar, probar, iterar y documentar cada etapa del proceso. Ya puse en práctica este enfoque durante mis prácticas de investigación UX/UI. Sigo abierta a proyectos de diseño de soluciones digitales, tanto en empresas como en laboratorios de investigación.",
 "skills_h":"Habilidades",
 "skills":["Full-Stack: React, Node.js, FastAPI, Python","Móvil: KivyMD, Flutter","Bases de datos: PostgreSQL, SQLite, Redis","UI/UX: Figma, prototipado, accesibilidad (WCAG)","Investigación: UX Research e investigación aplicada en general, design thinking","Gestión de proyectos digitales","Diseño gráfico, edición de vídeo"],
 "lang_h":"Idiomas",
 "langs":["Francés — lengua materna","Inglés — B2"],
 "soft_h":"Aptitudes personales",
 "soft":["Autonomía y organización","Trabajo en equipo y comunicación","Curiosidad y creatividad","Rigor y capacidad de análisis"],
 "engage_h":"Compromisos",
 "engage":["Formación continua en gestión de proyectos, Project Management Institute (PMI RDC)","Voluntaria, UNICEF Francia"],
 "interests_h":"Intereses",
 "interests":["Edición de vídeo y creación de contenidos visuales","Fotografía","Trato con las personas"],
 "exp_h":"Experiencia",
 "exp":[
  ("Becaria de investigación en diseño UX/UI","Université Catholique du Congo","2025","",
   ["Realización de estudios de usuarios (entrevistas, pruebas de usabilidad) para mejorar la experiencia de herramientas digitales universitarias",
    "Prototipado de interfaces en Figma e iteración de las maquetas a partir de los comentarios de los usuarios",
    "Contribución a un proyecto de investigación aplicada en interacción persona-ordenador y documentación de la metodología seguida"]),
  ("Becaria de informática","Société Nationale d'Électricité (SNEL RDC)","2024","",
   ["Participación en el despliegue de soluciones digitales y en el soporte técnico de primer nivel",
    "Análisis de incidencias comunes, redacción de documentación técnica y vigilancia tecnológica"]),
  ("Becaria docente de informática","Clase de último curso (Terminale)","2024","",
   ["Impartición de sesiones de iniciación a la informática para alumnos de último curso",
    "Elaboración de materiales didácticos y explicación clara de conceptos técnicos"]),
  ("Responsable de comunicación","Project Management Institute (PMI RDC)","2023 – 2025","",
   ["Diseño de materiales visuales y promocionales aplicando diseño gráfico y sentido del mensaje",
    "Organización de conferencias y coordinación logística de eventos, de la preparación a la ejecución",
    "Gestión de la comunicación interna y externa: contenidos claros y adaptados a distintos públicos",
    "Seguimiento y análisis del rendimiento de las acciones de comunicación, y propuestas de mejora"]),
 ],
 "edu_h":"Formación",
 "edu":[
  ("Máster 2 NTIC, itinerario Productos y Servicios Multimedia","Université de Franche-Comté, Montbéliard","2025 – 2027","Desarrollo móvil, narrativa multimedia, diseño interactivo",[]),
  ("Máster en Administración de Redes","Université Catholique du Congo","2023 – 2025","Gestión de proyectos, Internet de las cosas, administración de redes",[]),
  ("Grado en Informática","Université Catholique du Congo","2021 – 2023","Desarrollo web, sistemas de información, ciberseguridad",[]),
 ],
}

DE = {
 "lang":"de",
 "loc":"Montbéliard, Frankreich",
 "subtitle":"Full-Stack-Entwicklerin & UX/UI-Designerin · Masterstudentin für Neue Informations- und Kommunikationstechnologien",
 "c_email":"E-Mail","c_phone":"Tel.","c_loc":"Ort",
 "intro":"Ich konzipiere und entwickle Web- und Mobilanwendungen von Anfang bis Ende: Back-End, Front-End, Datenbank und Benutzeroberfläche. Angewandte Forschung steht im Mittelpunkt meiner Arbeit: einen Nutzerbedarf durch Beobachtung und Interviews verstehen, prototypisieren, testen, iterieren und jeden Schritt dokumentieren. Diesen Ansatz habe ich bereits während meines UX/UI-Forschungspraktikums umgesetzt. Ich bin offen für Projekte zur Gestaltung digitaler Lösungen, in Unternehmen wie auch in Forschungslaboren.",
 "skills_h":"Kompetenzen",
 "skills":["Full-Stack: React, Node.js, FastAPI, Python","Mobil: KivyMD, Flutter","Datenbanken: PostgreSQL, SQLite, Redis","UI/UX: Figma, Prototyping, Barrierefreiheit (WCAG)","Forschung: UX-Research und angewandte Forschung allgemein, Design Thinking","Digitales Projektmanagement","Grafikdesign, Videoschnitt"],
 "lang_h":"Sprachen",
 "langs":["Französisch — Muttersprache","Englisch — B2"],
 "soft_h":"Soft Skills",
 "soft":["Selbstständigkeit & Organisation","Teamarbeit & Kommunikation","Neugier & Kreativität","Sorgfalt & analytisches Denken"],
 "engage_h":"Engagement",
 "engage":["Weiterbildung im Projektmanagement, Project Management Institute (PMI RDC)","Ehrenamtliche Tätigkeit, UNICEF Frankreich"],
 "interests_h":"Interessen",
 "interests":["Videoschnitt & Erstellung visueller Inhalte","Fotografie","Umgang mit Menschen"],
 "exp_h":"Berufserfahrung",
 "exp":[
  ("Praktikantin UX/UI-Design-Forschung","Université Catholique du Congo","2025","",
   ["Durchführung von Nutzerstudien (Interviews, Usability-Tests) zur Verbesserung der Erfahrung mit digitalen Hochschul-Tools",
    "Prototyping von Oberflächen in Figma und Iteration der Entwürfe anhand von Nutzerfeedback",
    "Mitarbeit an einem angewandten Forschungsprojekt zur Mensch-Computer-Interaktion und Dokumentation der Methodik"]),
  ("IT-Praktikantin","Société Nationale d'Électricité (SNEL RDC)","2024","",
   ["Mitwirkung an der Einführung digitaler Lösungen und am First-Level-Support",
    "Analyse gängiger Störungen, Erstellung technischer Dokumentation und Technologiebeobachtung"]),
  ("Praktikantin als Informatiklehrerin","Abschlussklasse (Terminale)","2024","",
   ["Leitung von Einführungskursen in die Informatik für Abschlussschüler",
    "Erstellung von Unterrichtsmaterial und klare Erklärung technischer Konzepte"]),
  ("Kommunikationsverantwortliche","Project Management Institute (PMI RDC)","2023 – 2025","",
   ["Gestaltung visueller und werblicher Materialien mit Grafikdesign und Gespür für die Botschaft",
    "Organisation von Konferenzen und logistische Koordination von Veranstaltungen, von der Vorbereitung bis zur Durchführung",
    "Steuerung der internen und externen Kommunikation: klare, zielgruppengerechte Inhalte",
    "Monitoring und Analyse der Kommunikationsleistung sowie Verbesserungsvorschläge"]),
 ],
 "edu_h":"Ausbildung",
 "edu":[
  ("Master 2 NIKT, Studienrichtung Multimedia-Produkte & -Dienste","Université de Franche-Comté, Montbéliard","2025 – 2027","Mobile Entwicklung, multimediales Storytelling, interaktives Design",[]),
  ("Master in Netzwerkadministration","Université Catholique du Congo","2023 – 2025","Projektmanagement, Internet der Dinge, Netzwerkadministration",[]),
  ("Bachelor in Informatik","Université Catholique du Congo","2021 – 2023","Webentwicklung, Informationssysteme, Cybersicherheit",[]),
 ],
}

io.open(os.path.join(OUT,"cv_fr.html"),"w",encoding="utf-8").write(build(FR))
io.open(os.path.join(OUT,"cv_en.html"),"w",encoding="utf-8").write(build(EN))
io.open(os.path.join(OUT,"cv_es.html"),"w",encoding="utf-8").write(build(ES))
io.open(os.path.join(OUT,"cv_de.html"),"w",encoding="utf-8").write(build(DE))
print("ok")

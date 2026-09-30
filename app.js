import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import {
  firebaseConfig as C,
  ADMIN_EMAIL
} from "./firebase-config.js";


const live = !/^YOUR/.test(C.apiKey);

let db,
    auth,
    ref,
    storage,
    CURRENT_USER = null;

const A = "assets/lokhit-";


/* =========================================================
   DEFAULT CONTENT
   ========================================================= */

const D = {

  nav_about:"About",
  nav_team:"Team",
  nav_projects:"Projects",
  nav_kits:"Delegate kits",
  nav_contact:"Contact",

  editor:"Sign in",

  brand1:"Lokhit",
  brand2:"Foundation",

  heroLabel:"Jaipur · Rajasthan",

  heroTitle:
    "Planting trees is the work. Keeping them alive is the promise.",

  heroBody:
    "Lokhit works with schools, neighbourhoods and local stewards to bring shade back to Jaipur — one considered site at a time.",

  cta_how:"How we work",
  cta_work:"See the work",

  heroCap:
    "A foundation for\nthe places we share",

  coord:"26°54′N",

  heroImg:"",

  prem_lbl:"The premise",

  missionTitle:
    "The city is a living thing.",

  missionBody:
    "We plant where a tree can become part of daily life: beside a classroom, along a dusty edge, in the shared space between homes. The work is measured in care, not ceremony.",

  way_lbl:"A way of working",

  approachTitle:
    "Start with the ground.",

  approachBody:
    "We listen to the people who use a place, choose what can survive there, then return to water, mulch and tend every sapling until it can stand on its own.",

  cta_more:"More about our approach",

  img1:A+"a6-chitpad.png",
  img2:A+"a5-notepad.png",

  work_lbl:"Selected work",

  work_side:
    "What is planted\nis tended",

  view_project:"View project",
  cta_all:"All projects",

  take_lbl:"Take part",

  take_h:
    "Bring a little more shade into the picture.",

  take_p:
    "A project can start with a school, a street, a team or a conversation. If you have a place in mind, we would like to hear about it.",

  cta_start:"Start a conversation",

  foot_tag:
    "A little more shade for the places we share.",

  foot_find:"Find your way",

  foot_based:"Based in",

  foot_loc:
    "Jaipur, Rajasthan\nIndia",

  contactEmail:
    "hello@lokhitfoundation.org",

  foot_copy:"Lokhit Foundation",
  foot_made:"Made for the long view",

  about_lbl:"About Lokhit",

  about_a:
    "The work is simple.",

  about_b:
    "The conditions are not.",

  why_lbl:"Why trees",

  why_h:
    "A tree is public infrastructure.",

  why_p1:
    "It cools a courtyard. It catches dust. It gives a child a place to wait. It makes the distance between two houses feel inhabitable.",

  why_p2:
    "In Jaipur, the right tree in the right place is not decoration. It is a daily act of resilience — and it asks for more than a photograph on planting day.",

  how_lbl:"How we plant",

  s1t:"Read the place",

  s1b:
    "We begin with heat, water, footfall and the people who already care for a site.",

  s2t:"Choose what lasts",

  s2b:
    "Species, spacing and soil are decisions made for the conditions — not the brochure.",

  s3t:"Return often",

  s3b:
    "The first season is the beginning. We build simple routines that make care visible and shared.",

  team_lbl:
    "The people behind the work",

  team_a:"Small team.",

  team_b:"Long attention.",

  team_p:
    "Lokhit is built around two kinds of work: being present in the field, and making it possible for others to show up well.",

  pr_lbl:"Work archive",

  pr_a:"Places we",

  pr_b:"have tended.",

  pr_p:
    "Projects are collaborations with a place. Read the notes, then tell us what your street needs.",

  field_note:"Field note",

  kt_lbl:
    "Delegate-kit partnerships",

  kt_a:"Useful objects.",

  kt_b:"Useful partnerships.",

  kt_p:
    "A delegate kit is often the first physical point of contact. We make that moment carry a little more thought — and a little less waste.",

  v_open:"View open",
  v_closed:"View closed",

  ct_lbl:"Contact",

  ct_a:"Tell us what",

  ct_b:"could grow here.",

  ct_p:
    "Have a site, a team or a question? We are based in Jaipur and open to useful conversations.",

  studio:"Studio",

  studio_v:
    "Jaipur, Rajasthan\nIndia",

  part_lbl:"For partnerships",

  part_v:
    "Delegate kits, planting projects, field collaborations and thoughtful ways to support the work.",

  resp_lbl:"Response time",

  resp_v:
    "We read every note. Give us a little context and we will write back."

};


/* =========================================================
   DEFAULT ARRAYS
   ========================================================= */

const L = {

  projects: [

    {
      title:"Schoolyard shade study",
      summary:"A living canopy for the hours between lessons.",
      body:
        "We work alongside school communities to identify the hottest edges, select resilient native species and build simple watering routines students can own.",
      imagePath:"",
      location:"Jaipur",
      year:"2024",
      featured:true
    },

    {
      title:"The street edge, restored",
      summary:"Turning leftover ground into a place to pause.",
      body:
        "A small planting intervention can change the way a lane is used. This project pairs street-level planting with resident stewardship and a clear maintenance rhythm.",
      imagePath:"",
      location:"Sanganer",
      year:"2023",
      featured:false
    }

  ],

  kits: [

    {
      title:"Jute field folder",
      summary:"A useful object with a lower footprint.",
      body:
        "Designed for conference days and field notes, the jute folder carries the quiet tactility of a material chosen with purpose.",
      imagePaths:[
        A+"jute-folder.png",
        A+"jute-folder-open.png"
      ],
      category:"Material study",
      year:"2024"
    },

    {
      title:"The diplomat’s desk",
      summary:"A set of paper goods for considered work.",
      body:
        "Notepads and tearable chit-pads that invite a second look, made for partners who prefer the analogue to the disposable.",
      imagePaths:[
        A+"a5-notepad.png",
        A+"a6-chitpad.png"
      ],
      category:"Paper goods",
      year:"2024"
    },

    {
      title:"Semi-leather folio",
      summary:"A reusable companion for the long meeting.",
      body:
        "A restrained folio that gets better with use. The object is a reminder: a partnership should leave something useful behind.",
      imagePaths:[
        A+"leather-folder.png",
        A+"leather-folder-open.png"
      ],
      category:"Material study",
      year:"2023"
    }

  ],

  team: [

    {
      name:"Aarav Pandey",
      role:"Founder & field lead",
      bio:
        "Aarav turns long walks through Jaipur into planting plans. His work is rooted in patient observation, local knowledge and the belief that public space belongs to everyone.",
      imagePath:""
    },

    {
      name:"Daksh Wadekar",
      role:"Partnerships & operations",
      bio:
        "Daksh builds the practical bridges that make good work repeatable — with schools, teams, institutions and the people who keep a place alive after planting day.",
      imagePath:""
    }

  ]

};


const NEW = {

  projects:{
    title:"New project",
    summary:"Short summary",
    body:"Details about the project.",
    imagePath:"",
    location:"Jaipur",
    year:"2025",
    featured:false
  },

  kits:{
    title:"New kit",
    summary:"Short summary",
    body:"Details about the kit.",
    imagePaths:["",""],
    category:"Category",
    year:"2025"
  },

  team:{
    name:"New person",
    role:"Role",
    bio:"Short bio.",
    imagePath:""
  }

};


let S = {
  t:{...D},
  ...JSON.parse(JSON.stringify(L))
};

let EDIT = false;
let open = {};


/* =========================================================
   HELPERS
   ========================================================= */

const esc = s =>
  String(s ?? "").replace(
    /[&<>"]/g,
    c => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;"
    }[c])
  );


const e = k =>
  `<span data-k="${k}">${esc(S.t[k] ?? D[k])}</span>`;


const f = (l,i,fl) =>
  `<span data-l="${l}" data-i="${i}" data-f="${fl}">${esc(S[l][i][fl])}</span>`;


const mp = p =>
  p ? esc(p) : "";


const lab = (n,k) =>
  `<div class="lab"><b>${n}</b>${e(k)}</div>`;


const al = (h,k) =>
  `<a class="al" href="#/${h}">${e(k)} <span>↗</span></a>`;


const mono = c =>
  `<div class="ph ${c}">
    <img src="${A}logo.png" alt="">
  </div>`;


const timg = (k,c,alt,fb) => {

  const v = S.t[k] ?? D[k];

  return v

    ? `<div class="${c}" data-im="t:${k}">
        <img
          class="gs"
          src="${mp(v)}"
          alt="${alt}"
        >
      </div>`

    : `<div class="${c}" data-im="t:${k}">
        ${fb || mono("")}
      </div>`;
};


const limg = (l,i,fl,c,alt) => {

  const v = S[l][i][fl];

  return `
    <div
      class="${c}"
      data-im="l:${l}:${i}:${fl}"
    >
      ${
        v
          ? `<img
              class="gs"
              src="${mp(v)}"
              alt="${esc(alt)}"
            >`
          : mono("")
      }
    </div>
  `;
};


const ctl = (l,i) =>
  `<div class="ctl">

    <button
      data-a="up"
      data-l="${l}"
      data-i="${i}"
    >
      ↑
    </button>

    <button
      data-a="dn"
      data-l="${l}"
      data-i="${i}"
    >
      ↓
    </button>

    ${
      l == "projects"
        ? `<button
            data-a="ft"
            data-l="${l}"
            data-i="${i}"
          >
            ★ ${S[l][i].featured ? "featured" : "feature"}
          </button>`
        : ""
    }

    <button
      data-a="del"
      data-l="${l}"
      data-i="${i}"
    >
      ✕ delete
    </button>

  </div>`;


const addb = l =>
  `<button
    class="addb"
    data-a="add"
    data-l="${l}"
  >
    + Add ${
      l.slice(0,-1) == "team"
        ? "person"
        : l.slice(0,-1)
    }
  </button>`;


const hero = (a,b,n) =>
  `<h1 class="hh">
    ${e(a)}<br>
    <span class="dim">${e(b)}</span>
  </h1>`;


const page = (x,c="") =>
  `<main class="w pg ${c}">
    ${x}
  </main>`;


/* =========================================================
   PAGES
   ========================================================= */

const P = {

  home:() => {

    const p =
      S.projects.slice(0,2);

    return `
      <main>

        <section
          class="w g"
          style="
            --c:1fr 1.1fr;
            align-items:end;
            padding-top:112px;
            padding-bottom:112px
          "
        >

          <div class="rise">

            ${lab("00","heroLabel")}

            <h1
              class="hh"
              style="
                font-size:clamp(4rem,9vw,9.6rem);
                line-height:.84;
                letter-spacing:-.055em;
                max-width:720px
              "
            >
              ${e("heroTitle")}
            </h1>

            <p
              class="m"
              style="
                margin-top:36px;
                max-width:448px;
                font-size:18px;
                line-height:1.75
              "
            >
              ${e("heroBody")}
            </p>

            <div
              style="
                margin-top:40px;
                display:flex;
                flex-wrap:wrap;
                gap:28px
              "
            >
              ${al("about","cta_how")}
              ${al("projects","cta_work")}
            </div>

          </div>


          <div
            class="rise"
            style="
              position:relative;
              min-height:540px
            "
          >

            <div
              style="
                position:absolute;
                inset:0 8% 0 0;
                border:1px solid rgba(0,0,0,.15);
                background:#deddda
              "
            >

              <div
                style="
                  position:absolute;
                  inset:48px;
                  border:1px solid rgba(0,0,0,.2)
                "
              ></div>

              <div
                class="mono pre"
                style="
                  position:absolute;
                  left:48px;
                  bottom:48px;
                  color:rgba(0,0,0,.45)
                "
              >
                ${e("heroCap")}
              </div>

              <div
                class="mono"
                style="
                  position:absolute;
                  right:40px;
                  top:40px;
                  color:rgba(0,0,0,.45)
                "
              >
                ${e("coord")}
              </div>

            </div>

            ${timg(
              "heroImg",
              "",
              "Lokhit field work"
            ).replace(
              'class=""',
              'style="position:absolute;right:0;bottom:0;width:65%;height:68%;overflow:hidden"'
            )}

          </div>

        </section>


        <section class="band">

          <div
            class="w g"
            style="
              --c:.5fr 1.3fr 1fr;
              padding-top:80px;
              padding-bottom:80px
            "
          >

            ${lab("01","prem_lbl")}

            <p
              class="serif"
              style="
                font-size:clamp(2.2rem,4.5vw,3.75rem);
                line-height:.98;
                letter-spacing:-.025em;
                max-width:768px
              "
            >
              ${e("missionTitle")}
            </p>

            <p
              class="m s"
              style="max-width:384px"
            >
              ${e("missionBody")}
            </p>

          </div>

        </section>


        <section
          class="w g"
          style="
            --c:.65fr 1fr 1.2fr;
            padding-top:128px;
            padding-bottom:128px
          "
        >

          ${lab("02","way_lbl")}

          <div>

            <h2
              class="big"
              style="
                font-size:clamp(3rem,5.5vw,4.5rem)
              "
            >
              ${e("approachTitle")}
            </h2>

            <p
              class="m"
              style="
                margin:32px 0 36px;
                max-width:448px;
                line-height:1.75
              "
            >
              ${e("approachBody")}
            </p>

            ${al("about","cta_more")}

          </div>


          <div
            style="
              display:grid;
              grid-template-columns:1fr 1fr;
              gap:8px;
              align-self:end
            "
          >

            ${timg(
              "img1",
              "ar",
              "Field notes"
            ).replace(
              'class="ar"',
              'class="ar" style="background:#000"'
            )}

            ${timg(
              "img2",
              "ar",
              "Working notes"
            ).replace(
              'class="ar"',
              'class="ar" style="margin-top:48px"'
            )}

          </div>

        </section>


        <section
          class="blk"
          style="padding:112px 0"
        >

          <div class="w">

            <div
              style="
                display:flex;
                justify-content:space-between;
                align-items:flex-end
              "
            >

              ${lab("03","work_lbl")}

              <div
                class="mono pre"
                style="
                  text-align:right;
                  color:rgba(255,255,255,.4)
                "
              >
                ${e("work_side")}
              </div>

            </div>


            <div
              class="g"
              style="
                --c:1fr 1fr;
                gap:0
              "
            >

              ${p.map(
                (x,i) => `
                  <a
                    href="#/projects"
                    class="g"
                    style="
                      --c:110px 1fr;
                      border-top:1px solid rgba(255,255,255,.25);
                      padding:32px 0;
                      ${i ? "margin-left:80px" : ""}
                    "
                  >

                    <div
                      class="mono"
                      style="color:rgba(255,255,255,.45)"
                    >
                      0${i+1}<br>
                      ${f("projects",i,"year")}
                    </div>

                    <div>

                      <h3
                        style="
                          font-size:clamp(2.2rem,3.5vw,3rem);
                          letter-spacing:-.03em
                        "
                      >
                        ${f("projects",i,"title")}
                      </h3>

                      <p
                        style="
                          margin-top:12px;
                          max-width:448px;
                          font-size:14px;
                          color:rgba(255,255,255,.55)
                        "
                      >
                        ${f("projects",i,"summary")}
                      </p>

                      <span
                        class="mono"
                        style="
                          display:block;
                          margin-top:24px;
                          color:rgba(255,255,255,.7)
                        "
                      >
                        ${e("view_project")} ↗
                      </span>

                    </div>

                  </a>
                `
              ).join("")}

            </div>


            <div style="margin-top:32px">
              ${al("projects","cta_all")}
            </div>

          </div>

        </section>


        <section
          class="w g"
          style="
            --c:1fr 1fr;
            padding-top:112px;
            padding-bottom:112px
          "
        >

          <div>

            ${lab("04","take_lbl")}

            <h2
              class="big"
              style="
                font-size:clamp(3rem,5.5vw,4.5rem);
                max-width:672px
              "
            >
              ${e("take_h")}
            </h2>

          </div>


          <div
            style="
              display:flex;
              flex-direction:column;
              justify-content:flex-end
            "
          >

            <p
              class="m"
              style="
                max-width:448px;
                line-height:1.75
              "
            >
              ${e("take_p")}
            </p>

            <div style="margin-top:32px">
              ${al("contact","cta_start")}
            </div>

          </div>

        </section>

      </main>
    `;
  },


  about:() => `
    <main>

      <section
        class="w"
        style="
          padding-top:128px;
          padding-bottom:112px
        "
      >

        ${lab("01","about_lbl")}

        <h1
          class="hh"
          style="
            font-size:clamp(4rem,9vw,9.6rem);
            max-width:1024px
          "
        >
          ${e("about_a")}<br>
          <span class="dim">${e("about_b")}</span>
        </h1>

        <p
          class="m"
          style="
            margin:48px 0 0 25%;
            max-width:576px;
            font-size:18px;
            line-height:1.8
          "
        >
          ${e("missionBody")}
        </p>

      </section>


      <section class="band">

        <div
          class="w g"
          style="
            --c:1fr 1fr;
            padding-top:96px;
            padding-bottom:96px
          "
        >

          <div>

            ${lab("02","why_lbl")}

            <h2
              class="big"
              style="
                font-size:clamp(3rem,5.5vw,4.5rem);
                max-width:448px
              "
            >
              ${e("why_h")}
            </h2>

          </div>

          <div
            class="s"
            style="
              max-width:448px;
              color:rgba(0,0,0,.65)
            "
          >

            <p>${e("why_p1")}</p>

            <p style="margin-top:28px">
              ${e("why_p2")}
            </p>

          </div>

        </div>

      </section>


      <section
        class="w g"
        style="
          --c:.6fr 1fr;
          padding-top:128px;
          padding-bottom:128px
        "
      >

        ${lab("03","how_lbl")}

        <div>

          ${[1,2,3].map(
            n => `
              <div
                class="row g"
                style="
                  --c:60px 1fr;
                  gap:16px
                "
              >

                <span
                  class="mono"
                  style="color:rgba(0,0,0,.45)"
                >
                  0${n}
                </span>

                <div>

                  <h3 style="font-size:30px">
                    ${e("s"+n+"t")}
                  </h3>

                  <p
                    class="s"
                    style="
                      margin-top:8px;
                      max-width:448px;
                      color:rgba(0,0,0,.55)
                    "
                  >
                    ${e("s"+n+"b")}
                  </p>

                </div>

              </div>
            `
          ).join("")}

        </div>

      </section>

    </main>
  `,


  team:() =>
    page(`
      ${lab("01","team_lbl")}

      <div
        class="g"
        style="
          --c:1fr auto;
          align-items:end
        "
      >

        <h1 class="hh">
          ${e("team_a")}<br>
          <span class="dim">${e("team_b")}</span>
        </h1>

        <p
          class="s"
          style="
            max-width:320px;
            color:rgba(0,0,0,.55)
          "
        >
          ${e("team_p")}
        </p>

      </div>


      <div
        class="g"
        style="
          --c:1fr 1fr;
          gap:80px;
          margin-top:80px
        "
      >

        ${S.team.map(
          (x,i) => `
            <article
              style="${i%2 ? "margin-top:128px" : ""}"
            >

              ${ctl("team",i)}

              ${limg(
                "team",
                i,
                "imagePath",
                "ar",
                x.name
              )}

              <div
                style="
                  display:flex;
                  justify-content:space-between;
                  margin-top:20px
                "
              >

                <div>

                  <h2
                    style="
                      font-size:36px;
                      letter-spacing:-.03em
                    "
                  >
                    ${f("team",i,"name")}
                  </h2>

                  <p
                    class="mono"
                    style="
                      margin-top:4px;
                      color:rgba(0,0,0,.45)
                    "
                  >
                    ${f("team",i,"role")}
                  </p>

                </div>

                <span class="mono dim">
                  0${i+1}
                </span>

              </div>

              <p
                class="s m"
                style="
                  margin-top:20px;
                  max-width:448px
                "
              >
                ${f("team",i,"bio")}
              </p>

            </article>
          `
        ).join("")}

      </div>

      ${addb("team")}
    `),


  projects:() =>
    page(`
      ${lab("01","pr_lbl")}

      <div
        class="g"
        style="
          --c:1fr auto;
          align-items:end
        "
      >

        <h1 class="hh">
          ${e("pr_a")}<br>
          <span class="dim">${e("pr_b")}</span>
        </h1>

        <p
          class="s"
          style="
            max-width:320px;
            color:rgba(0,0,0,.55)
          "
        >
          ${e("pr_p")}
        </p>

      </div>


      <div
        style="
          margin-top:80px;
          border-top:1px solid rgba(0,0,0,.2)
        "
      >

        ${S.projects.map(
          (p,i) => `
            <article
              class="g"
              style="
                --c:100px 1fr 1.1fr;
                padding:${p.featured ? "56px 28px" : "56px 0"};
                margin:0 ${p.featured ? "-28px" : "0"};
                border-bottom:1px solid rgba(0,0,0,.2);
                ${p.featured ? "background:var(--g)" : ""}
              "
            >

              <div
                class="mono"
                style="color:rgba(0,0,0,.45)"
              >

                ${ctl("projects",i)}

                0${i+1}<br>
                ${f("projects",i,"year")}<br>
                ${f("projects",i,"location")}

              </div>


              <div>

                <h2
                  style="
                    font-size:clamp(2.2rem,4vw,3.75rem);
                    line-height:.95;
                    letter-spacing:-.03em;
                    max-width:512px
                  "
                >
                  ${f("projects",i,"title")}
                </h2>

                <p
                  class="s"
                  style="
                    margin-top:16px;
                    max-width:448px;
                    color:rgba(0,0,0,.55)
                  "
                >
                  ${f("projects",i,"summary")}
                </p>

              </div>


              <div style="max-width:448px">

                <p
                  class="s"
                  style="color:rgba(0,0,0,.65)"
                >
                  ${f("projects",i,"body")}
                </p>

                <span
                  class="mono"
                  style="
                    display:block;
                    margin-top:32px
                  "
                >
                  ${e("field_note")} ↘
                </span>

              </div>

            </article>
          `
        ).join("")}

      </div>

      ${addb("projects")}
    `),


  kits:() =>
    page(`
      ${lab("01","kt_lbl")}

      <div
        class="g"
        style="
          --c:1.1fr .8fr;
          align-items:end
        "
      >

        <h1 class="hh">
          ${e("kt_a")}<br>
          <span class="dim">${e("kt_b")}</span>
        </h1>

        <p
          class="s"
          style="
            max-width:384px;
            color:rgba(0,0,0,.55)
          "
        >
          ${e("kt_p")}
        </p>

      </div>


      <div
        class="g"
        style="
          --c:1fr 1fr;
          gap:48px;
          margin-top:80px
        "
      >

        ${S.kits.map(
          (k,i) => {

            const im =
              k.imagePaths || [];

            const o =
              open[i] &&
              im[1];

            const src =
              im[o ? 1 : 0] ||
              im[0] ||
              A+"jute-folder.png";

            return `
              <article
                style="${i%2 ? "margin-top:112px" : ""}"
              >

                ${ctl("kits",i)}

                <div
                  class="kit"
                  data-kit="${i}"
                  data-im="l:kits:${i}:imagePaths"
                >

                  <img
                    class="gs"
                    src="${mp(src)}"
                    alt="${esc(k.title)}"
                  >

                  <span class="tag">
                    ${e(o ? "v_closed" : "v_open")} ›
                  </span>

                </div>


                <div
                  style="
                    display:flex;
                    justify-content:space-between;
                    margin-top:20px
                  "
                >

                  <div>

                    <p
                      class="mono"
                      style="color:rgba(0,0,0,.45)"
                    >
                      ${f("kits",i,"category")}
                      ·
                      ${f("kits",i,"year")}
                    </p>

                    <h2
                      style="
                        font-size:36px;
                        line-height:.95;
                        letter-spacing:-.03em;
                        margin-top:12px
                      "
                    >
                      ${f("kits",i,"title")}
                    </h2>

                    <p
                      class="s"
                      style="
                        margin-top:12px;
                        max-width:448px;
                        color:rgba(0,0,0,.55)
                      "
                    >
                      ${f("kits",i,"summary")}
                    </p>

                  </div>

                  <span>↗</span>

                </div>


                <p
                  class="s"
                  style="
                    margin-top:20px;
                    max-width:448px;
                    color:rgba(0,0,0,.65)
                  "
                >
                  ${f("kits",i,"body")}
                </p>

              </article>
            `;
          }
        ).join("")}

      </div>

      ${addb("kits")}
    `),


  contact:() =>
    page(`
      ${lab("01","ct_lbl")}

      <div
        class="g"
        style="--c:1.3fr .7fr"
      >

        <h1
          class="hh"
          style="
            font-size:clamp(4.3rem,9vw,9rem);
            line-height:.8
          "
        >
          ${e("ct_a")}<br>
          <span class="dim">${e("ct_b")}</span>
        </h1>

        <div style="align-self:end">

          <p
            class="s"
            style="
              max-width:384px;
              color:rgba(0,0,0,.6)
            "
          >
            ${e("ct_p")}
          </p>

          <a
            class="mono"
            data-mail
            href="mailto:${esc(S.t.contactEmail)}"
            style="
              display:inline-block;
              margin-top:36px;
              border-bottom:1px solid #000;
              padding-bottom:8px
            "
          >
            ✉ ${e("contactEmail")}
          </a>

        </div>

      </div>


      <div
        class="g"
        style="
          --c:1fr 1fr 1fr;
          margin-top:96px;
          border-top:1px solid rgba(0,0,0,.2);
          padding-top:28px
        "
      >

        <div>

          <p
            class="mono"
            style="color:rgba(0,0,0,.45)"
          >
            ${e("studio")}
          </p>

          <p
            class="serif pre"
            style="
              margin-top:16px;
              font-size:24px;
              line-height:1.3
            "
          >
            ${e("studio_v")}
          </p>

        </div>


        <div>

          <p
            class="mono"
            style="color:rgba(0,0,0,.45)"
          >
            ${e("part_lbl")}
          </p>

          <p
            class="s"
            style="
              margin-top:16px;
              max-width:320px;
              color:rgba(0,0,0,.6)
            "
          >
            ${e("part_v")}
          </p>

        </div>


        <div>

          <p
            class="mono"
            style="color:rgba(0,0,0,.45)"
          >
            ${e("resp_lbl")}
          </p>

          <p
            class="s"
            style="
              margin-top:16px;
              max-width:320px;
              color:rgba(0,0,0,.6)
            "
          >
            ${e("resp_v")}
          </p>

        </div>

      </div>
    `)

};


/* =========================================================
   NAVIGATION + SHELL
   ========================================================= */

const links = [
  ["about","nav_about"],
  ["team","nav_team"],
  ["projects","nav_projects"],
  ["delegate-kits","nav_kits"],
  ["contact","nav_contact"]
];


const shell = x =>
  `
    <header>

      <div class="w">

        <a
          class="brand"
          href="#/"
        >

          <img
            src="${A}logo.png"
            alt="Lokhit Foundation mark"
          >

          <div>

            <span>${e("brand1")}</span>
            <i>${e("brand2")}</i>

          </div>

        </a>


        <nav
          class="nav"
          id="nv"
        >

          ${links.map(
            ([h,k]) =>
              `<a href="#/${h}">
                ${e(k)}
              </a>`
          ).join("")}

        </nav>


        <button
          class="btn"
          id="adm"
        >
          ${e("editor")}
        </button>


        <button
          id="burger"
          aria-label="Menu"
        >
          ☰
        </button>

      </div>

    </header>

    ${x}


    <footer>

      <div class="w">

        <div
          class="g"
          style="
            --c:1.5fr 1fr 1fr;
            gap:40px
          "
        >

          <div>

            <img
              src="${A}logo.png"
              alt=""
              style="
                height:40px;
                width:40px;
                object-fit:contain
              "
            >

            <p
              class="serif"
              style="
                margin-top:20px;
                max-width:384px;
                font-size:24px;
                line-height:1.05;
                color:rgba(255,255,255,.85)
              "
            >
              ${e("foot_tag")}
            </p>

          </div>


          <div>

            <p class="mono">
              ${e("foot_find")}
            </p>

            <div
              style="
                display:grid;
                gap:8px;
                margin-top:16px;
                font-size:14px
              "
            >

              ${links
                .filter(l => l[0] != "team")
                .map(
                  ([h,k]) =>
                    `<a href="#/${h}">
                      ${e(k)}
                    </a>`
                )
                .join("")}

            </div>

          </div>


          <div>

            <p class="mono">
              ${e("foot_based")}
            </p>

            <p
              class="s pre"
              style="margin-top:16px"
            >
              ${e("foot_loc")}
            </p>

            <a
              class="s"
              data-mail
              href="mailto:${esc(S.t.contactEmail)}"
              style="
                display:inline-block;
                margin-top:20px
              "
            >
              ✉ ${e("contactEmail")}
            </a>

          </div>

        </div>


        <div class="fb mono">

          <span>
            © ${new Date().getFullYear()}
            ${e("foot_copy")}
          </span>

          <span>
            ${e("foot_made")}
          </span>

        </div>

      </div>

    </footer>
  `;


/* =========================================================
   ROUTING
   ========================================================= */

function route(){

  return (
    location.hash
      .replace(/^#\/?/,"")
      || "home"
  ).split("?")[0];

}


function render(){

  const r =
    route();

  const k =
    r == "delegate-kits"
      ? "kits"
      : r;


  document.getElementById(
    "app"
  ).innerHTML =
    shell(
      (P[k] || P.home)()
    );


  document.body.classList.toggle(
    "edit",
    EDIT
  );


  if(EDIT){

    document
      .querySelectorAll(
        "[data-k],[data-l][data-f]"
      )
      .forEach(
        el =>
          el.contentEditable =
            "plaintext-only"
      );

  }


  document.getElementById(
    "adm"
  ).onclick = () => {

    if(auth?.currentUser){

      EDIT = true;

      render();

      bar();

    }

    else if(live){

      document
        .getElementById("dlg")
        .showModal();

    }

    else{

      alert(
        "Add your Firebase config in firebase-config.js to enable the editor."
      );

    }

  };


  document.getElementById(
    "burger"
  ).onclick = () =>
    document
      .getElementById("nv")
      .classList
      .toggle("o");

}


addEventListener(
  "hashchange",
  () => {

    render();

    scrollTo(
      0,
      0
    );

  }
);


/* =========================================================
   SAVING
   ========================================================= */

const st =
  m =>
    document.getElementById(
      "st"
    ).textContent = m;


async function save(p){

  if(!live)
    return;

  st("Saving…");

  try{

    await setDoc(
      ref,
      p,
      {
        merge:true
      }
    );

    st("Saved ✓");

  }

  catch(x){

    st(
      "Save failed: " +
      x.code
    );

  }

}


/* =========================================================
   EDITABLE TEXT
   ========================================================= */

document.addEventListener(
  "focusout",
  ev => {

    const el =
      ev.target;

    if(
      !EDIT ||
      !el.dataset
    )
      return;


    const v =
      el.textContent.trim();


    if(el.dataset.k){

      const k =
        el.dataset.k;

      if(
        S.t[k] === v
      )
        return;


      S.t[k] =
        v;


      save({
        t:{
          [k]:v
        }
      });

    }

    else if(
      el.dataset.l &&
      el.dataset.f
    ){

      const {
        l,
        i,
        f:fl
      } =
        el.dataset;


      if(
        S[l][i][fl] === v
      )
        return;


      S[l][i][fl] =
        v;


      save({
        [l]:
          S[l]
      });

    }

  }
);


/* =========================================================
   CONTACT FORM
   ========================================================= */

document.addEventListener(
  "submit",
  async ev => {

    const form =
      ev.target.closest(
        "#contactForm"
      );

    if(!form)
      return;


    ev.preventDefault();


    if(!live){

      alert(
        "Firebase is not configured."
      );

      return;

    }


    const status =
      document.getElementById(
        "contactStatus"
      );


    try{

      const data =
        new FormData(form);


      await addDoc(
        collection(
          db,
          "messages"
        ),
        {

          name:
            String(
              data.get("name") || ""
            ).trim(),

          email:
            String(
              data.get("email") || ""
            ).trim(),

          subject:
            String(
              data.get("subject") || ""
            ).trim(),

          message:
            String(
              data.get("message") || ""
            ).trim(),

          createdAt:
            serverTimestamp()

        }
      );


      form.reset();


      status.textContent =
        "Message sent. Thank you — we’ll be in touch.";

    }

    catch(x){

      status.textContent =
        "Could not send: " +
        (
          x.code ||
          x.message
        );

    }

  }
);


/* =========================================================
   ENTER TO FINISH EDIT
   ========================================================= */

document.addEventListener(
  "keydown",
  ev => {

    if(
      EDIT &&
      ev.key == "Enter" &&
      ev.target.isContentEditable &&
      !ev.shiftKey &&
      !ev.target.closest(".pre")
    ){

      ev.preventDefault();

      ev.target.blur();

    }

  }
);


/* =========================================================
   CLICK HANDLER
   ========================================================= */

document.addEventListener(
  "click",
  ev => {

    const t =
      ev.target;


    /* Delegate-kit image buttons */

    const ie =
      t.closest(
        "[data-imgedit]"
      );


    if(ie){

      ev.preventDefault();


      const p =
        ie.dataset.imgedit
          .split(":");


      uploadKitImage(
        Number(p[1]),
        Number(p[2])
      );


      return;

    }


    /* Editor mode */

    if(EDIT){

      /* Image clicked */

      const im =
        t.closest(
          "[data-im]"
        );


      if(im){

        ev.preventDefault();


        const p =
          im.dataset.im
            .split(":");


        if(
          p[0] == "t"
        ){

          uploadImageForTarget({
            type:"text",
            key:p[1]
          });

        }


        else if(
          p[3] == "imagePaths"
        ){

          uploadKitImage(
            Number(p[2]),
            open[Number(p[2])]
              ? 1
              : 0
          );

        }


        else{

          uploadImageForTarget({
            type:"field",
            list:p[1],
            index:Number(p[2]),
            field:p[3]
          });

        }


        return;

      }


      /* Add / delete / reorder */

      const b =
        t.closest(
          "[data-a]"
        );


      if(b){

        ev.preventDefault();


        const {
          a,
          l,
          i
        } =
          b.dataset;


        const n =
          Number(i);

        const arr =
          S[l];


        if(
          a == "add"
        ){

          arr.push(
            JSON.parse(
              JSON.stringify(
                NEW[l]
              )
            )
          );

        }


        if(
          a == "del" &&
          confirm(
            "Delete this item?"
          )
        ){

          arr.splice(
            n,
            1
          );

        }


        if(
          a == "up" &&
          n > 0
        ){

          [
            arr[n-1],
            arr[n]
          ] =
          [
            arr[n],
            arr[n-1]
          ];

        }


        if(
          a == "dn" &&
          n < arr.length - 1
        ){

          [
            arr[n+1],
            arr[n]
          ] =
          [
            arr[n],
            arr[n+1]
          ];

        }


        if(
          a == "ft"
        ){

          arr[n].featured =
            !arr[n].featured;

        }


        save({
          [l]:arr
        });


        render();

        return;

      }


      if(
        t.closest("[contenteditable]") &&
        t.closest("a")
      ){

        ev.preventDefault();

      }


      return;

    }


    /* Delegate kit open / closed */

    const k =
      t.closest(
        "[data-kit]"
      );


    if(k){

      open[
        k.dataset.kit
      ] =
        !open[
          k.dataset.kit
        ];

      render();

    }


    /* Mobile navigation */

    if(
      t.closest(
        "a[href^='#']"
      ) ||
      t.closest("#nv")
    ){

      document
        .getElementById("nv")
        ?.classList
        .remove("o");

    }

  }
);


/* =========================================================
   ADMIN
   ========================================================= */

const isAdmin =
  u =>
    !!u &&
    String(
      u.email || ""
    ).toLowerCase() ===
    String(
      ADMIN_EMAIL || ""
    ).toLowerCase();


function bar(){

  const b =
    document.getElementById(
      "bar"
    );


  b.style.display =
    "flex";


  document.getElementById(
    "tg"
  ).style.display =
    "inline-block";


  document.getElementById(
    "tg"
  ).textContent =
    EDIT
      ? "Turn off"
      : "Turn on";


  st(
    EDIT
      ? "Edit mode — click any text"
      : "Edit mode off"
  );

}


function barSignedIn(){

  const b =
    document.getElementById(
      "bar"
    );


  b.style.display =
    "flex";


  document.getElementById(
    "tg"
  ).style.display =
    "none";


  document.getElementById(
    "pgs"
  ).style.display =
    "none";


  st(
    "Signed in"
  );

}


/* =========================================================
   FILE UPLOAD
   ========================================================= */

async function uploadFile(
  file,
  path
){

  const r =
    storageRef(
      storage,
      path
    );


  await uploadBytes(
    r,
    file
  );


  return getDownloadURL(r);

}


function pickFile(){

  return new Promise(
    resolve => {

      const i =
        document.createElement(
          "input"
        );


      i.type =
        "file";

      i.accept =
        "image/*";


      i.onchange =
        () =>
          resolve(
            i.files?.[0] ||
            null
          );


      i.click();

    }
  );

}


async function uploadImageForTarget(
  target
){

  if(
    !isAdmin(
      CURRENT_USER
    )
  ){

    alert(
      "Only the admin account can edit images."
    );

    return;

  }


  const file =
    await pickFile();


  if(!file)
    return;


  st(
    "Uploading image…"
  );


  try{

    const safe =
      file.name.replace(
        /[^a-z0-9._-]/gi,
        "-"
      );


    const url =
      await uploadFile(
        file,
        `site-images/${Date.now()}-${safe}`
      );


    if(
      target.type ===
      "text"
    ){

      S.t[
        target.key
      ] =
        url;


      await save({
        t:{
          [target.key]:
            url
        }
      });

    }

    else{

      S[
        target.list
      ][
        target.index
      ][
        target.field
      ] =
        url;


      await save({
        [target.list]:
          S[target.list]
      });

    }


    render();

    st(
      "Saved ✓"
    );

  }

  catch(x){

    st(
      "Upload failed: " +
      (
        x.code ||
        x.message
      )
    );

  }

}


/* =========================================================
   DELEGATE KIT IMAGE UPLOAD
   ========================================================= */

async function uploadKitImage(
  i,
  which
){

  if(
    !isAdmin(
      CURRENT_USER
    )
  ){

    alert(
      "Only the admin account can edit images."
    );

    return;

  }


  const file =
    await pickFile();


  if(!file)
    return;


  st(
    "Uploading image…"
  );


  try{

    const safe =
      file.name.replace(
        /[^a-z0-9._-]/gi,
        "-"
      );


    const url =
      await uploadFile(
        file,
        `site-images/kits/${i}-${which}-${Date.now()}-${safe}`
      );


    const a =
      S.kits[i].imagePaths =
        S.kits[i].imagePaths ||
        ["",""];


    a[which] =
      url;


    await save({
      kits:
        S.kits
    });


    render();


    st(
      "Saved ✓"
    );

  }

  catch(x){

    st(
      "Upload failed: " +
      (
        x.code ||
        x.message
      )
    );

  }

}


/* =========================================================
   MERGE FIRESTORE DATA
   ========================================================= */

function merge(d){

  S = {

    t:{
      ...D,
      ...(d.t || {})
    },

    projects:
      Array.isArray(d.projects)
        ? d.projects
        : S.projects,

    kits:
      Array.isArray(d.kits)
        ? d.kits
        : S.kits,

    team:
      Array.isArray(d.team)
        ? d.team
        : S.team

  };

}


/* =========================================================
   FIREBASE
   ========================================================= */

if(live){

  const app =
    initializeApp(C);


  db =
    getFirestore(app);


  auth =
    getAuth(app);


  storage =
    getStorage(app);


  ref =
    doc(
      db,
      "site",
      "content"
    );


  onSnapshot(
    ref,
    s => {

      S = {
        t:{
          ...D
        },
        ...JSON.parse(
          JSON.stringify(L)
        )
      };


      if(
        s.exists()
      ){

        merge(
          s.data()
        );

      }


      if(
        !(
          document.activeElement &&
          document.activeElement.isContentEditable
        )
      ){

        render();

      }

    },

    () =>
      render()
  );


  onAuthStateChanged(
    auth,
    u => {

      CURRENT_USER =
        u;


      if(
        u &&
        isAdmin(u)
      ){

        EDIT =
          true;

        bar();

      }

      else if(u){

        EDIT =
          false;

        barSignedIn();

      }

      else{

        EDIT =
          false;

        document
          .getElementById("bar")
          .style.display =
          "none";

      }


      render();

    }
  );

}


/* Initial render */

render();

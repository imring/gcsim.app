const genshindb = require("genshin-db");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: "stream",
  })
    .then(
      (response) =>
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(image_path))
            .on("finish", () => resolve())
            .on("error", (e) => reject(e));
        })
    )
    .catch((e) => {
      console.log("error downloading: " + e);
      console.log("url is: " + url);
    });

const names = [
  "aether",
  "lumine",
  "albedo",
  "aloy",
  "amber",
  "barbara",
  "beidou",
  "bennett",
  "chongyun",
  "diluc",
  "diona",
  "eula",
  "fischl",
  "ganyu",
  "hutao",
  "jean",
  "kazuha",
  "kaeya",
  "ayaka",
  "keqing",
  "klee",
  "sara",
  "lisa",
  "mona",
  "ningguang",
  "noelle",
  "qiqi",
  "raiden",
  "razor",
  "rosaria",
  "kokomi",
  "sayu",
  "sucrose",
  "tartaglia",
  "thoma",
  "venti",
  "xiangling",
  "xiao",
  "xingqiu",
  "xinyan",
  "yanfei",
  "yoimiya",
  "zhongli",
  "gorou",
  "itto",
  "shenhe",
  "yunjin",
  "yaemiko",
  "ayato",
];

let chars = {};
let properKeyToChar = {};

let trans = {
  English: { artifact_names: {}, character_names: {}, weapon_names: {} },
  Chinese: { artifact_names: {}, character_names: {}, weapon_names: {} },
  Japanese: { artifact_names: {}, character_names: {}, weapon_names: {} },
  Spanish: { artifact_names: {}, character_names: {}, weapon_names: {} },
  Russian: { artifact_names: {}, character_names: {}, weapon_names: {} },
  German: { artifact_names: {}, character_names: {}, weapon_names: {} },
};

names.forEach((e) => {
  const eng = genshindb.characters(e);
  let key = eng.name.replace(/[^0-9a-z]/gi, "").toLowerCase();

  chars[e] = {
    key: e,
    name: eng.name,
    element: eng.element.toLowerCase(),
    weapon_type: eng.weapontype.toLowerCase(),
  };
  properKeyToChar[key] = e;

  const cn = genshindb.characters(e, { resultLanguage: "CHS" });
  const jp = genshindb.characters(e, { resultLanguage: "JP" });
  const es = genshindb.characters(e, { resultLanguage: "ES" });
  const ru = genshindb.characters(e, { resultLanguage: "RU" });
  const de = genshindb.characters(e, { resultLanguage: "DE" });

  trans["English"]["character_names"][e] = eng.name;
  trans["Chinese"]["character_names"][e] = cn.name;
  trans["Japanese"]["character_names"][e] = jp.name;
  trans["Spanish"]["character_names"][e] = es.name;
  trans["Russian"]["character_names"][e] = ru.name;
  trans["German"]["character_names"][e] = de.name;

  let filename = "./static/images/avatar/" + e + ".png";

  if (!fs.existsSync(filename)) {
    console.log(e + ": " + eng.images.icon);

    download_image(eng.images.icon.replace("-os", ""), filename)
      .then((msg) => {
        console.log("done downloading to file: ", filename);
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

fs.writeFileSync(
  "./src/Components/data/charNames.json",
  JSON.stringify(chars),
  "utf-8"
);

fs.writeFileSync(
  "./src/Components/data/charKeyToShort.json",
  JSON.stringify(properKeyToChar),
  "utf-8"
);

//download weapons and sets :(

const weapons = genshindb.weapons("names", { matchCategories: true });

let weap = {};

weapons.forEach((e) => {
  const eng = genshindb.weapons(e);

  let filename =
    "./static/images/weapons/" +
    eng.name.replace(/[^0-9a-z]/gi, "").toLowerCase() +
    ".png";

  const key = eng.name.replace(/[^0-9a-z]/gi, "").toLowerCase();
  weap[key] = eng.name;

  const cn = genshindb.weapons(e, { resultLanguage: "CHS" });
  const jp = genshindb.weapons(e, { resultLanguage: "JP" });
  const es = genshindb.weapons(e, { resultLanguage: "ES" });
  const ru = genshindb.weapons(e, { resultLanguage: "RU" });
  const de = genshindb.weapons(e, { resultLanguage: "DE" });

  trans["English"]["weapon_names"][key] = eng.name;
  trans["Chinese"]["weapon_names"][key] = cn.name;
  trans["Japanese"]["weapon_names"][key] = jp.name;
  trans["Spanish"]["weapon_names"][key] = es.name;
  trans["Russian"]["weapon_names"][key] = ru.name;
  trans["German"]["weapon_names"][key] = de.name;

  if (!fs.existsSync(filename)) {
    download_image(eng.images.icon.replace("-os", ""), filename)
      .then((msg) => {
        console.log("done downloading to file: ", filename);
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

fs.writeFileSync(
  "./src/Components/data/weaponNames.json",
  JSON.stringify(weap),
  "utf-8"
);

let setMap = {};
const sets = genshindb.artifacts("4", { matchCategories: true });

sets.forEach((e) => {
  const eng = genshindb.artifacts(e);

  let art = eng.name.replace(/[^0-9a-z]/gi, "").toLowerCase();
  setMap[art] = eng.name;

  const cn = genshindb.artifacts(e, { resultLanguage: "CHS" });
  const jp = genshindb.artifacts(e, { resultLanguage: "JP" });
  const es = genshindb.artifacts(e, { resultLanguage: "ES" });
  const ru = genshindb.artifacts(e, { resultLanguage: "RU" });
  const de = genshindb.artifacts(e, { resultLanguage: "DE" });

  trans["English"]["artifact_names"][art] = eng.name;
  trans["Chinese"]["artifact_names"][art] = cn.name;
  trans["Japanese"]["artifact_names"][art] = jp.name;
  trans["Spanish"]["artifact_names"][art] = es.name;
  trans["Russian"]["artifact_names"][art] = ru.name;
  trans["German"]["artifact_names"][art] = de.name;

  let filename;
  for (const [key, value] of Object.entries(eng.images)) {
    filename = `./static/images/artifacts/${art}_${key}.png`;

    if (!fs.existsSync(filename)) {
      console.log(`${key}: ${value}`);
      download_image(value.replace("-os", ""), filename)
        .then(() => {
          console.log("done downloading to file: ", filename);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
});

fs.writeFileSync(
  "./src/Components/data/artifactNames.json",
  JSON.stringify(setMap),
  "utf-8"
);

fs.writeFileSync(
  "./public/locales/IngameNames.json",
  JSON.stringify(trans),
  "utf-8"
);

import express, { response } from "express";
import fetch from "node-fetch";
const app = express();
import { Wrapper, AssetFinder } from "enkanetwork.js";
const { genshin, starrail } = new Wrapper({ cache: true });
const { genshin: genshinAsset, starrail: starrailAsset } = new AssetFinder({
  language: "en",
});
app.use(express.json());

let profiles = [];

app.get("/api", async (req, res) => {
  try {
    const response = await fetch("https://api.enka.network/#/");
    if (!response.ok) {
      res.send("down");
    } else {
      res.send("online");
    }
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/submit", async (req, res) => {
  const { uid } = req.body;
  let stats = [];
  let characterName = [];
  let characterData = [];
  let namecard;
  genshin
    .getPlayer(uid)
    .then((player) => {
      console.log(player);
      const { player: playerInfo, characters, uid } = player;
      for (let character of characters) {
        characterName.push();
        stats.push(character.stats);
        characterData.push({
          name: genshinAsset.character(character.characterId).name,
          iconurl: genshinAsset.toLink(
            genshinAsset.character(character.characterId).assets.sideIcon
          ),
          element: character.element,
          stars: character.stars,
          maxLevel: character.maxLevel,
          constellations: character.constellationsList,
          weaponName: character.equipment.weapon.name,
          weaponImg: genshinAsset.toLink(
            genshinAsset.weapon(character.equipment.weapon.weaponId).assets.icon
          ),
          artifact: character.equipment.artifacts,
        });
        let temp = genshinAsset.namecard(playerInfo.namecard.id).assets.picPath;
        if (temp.length > 1) {
          namecard = genshinAsset.toLink(temp[temp.length - 1]);
        } else {
          namecard = genshinAsset.toLink(temp);
        }
      }
      let profileUrl = genshinAsset.toLink(
        playerInfo.profilePicture.assets.icon
      );

      res.send({
        playerInfo,
        uid,
        namecard,
        characterData,
        profileUrl,
        stats,
      });
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500);
    });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

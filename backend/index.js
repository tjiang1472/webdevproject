import express, { response } from "express";
import fetch from "node-fetch";
import { Wrapper, AssetFinder } from "enkanetwork.js";
const { genshin, starrail } = new Wrapper({ cache: true });
const { genshin: genshinAsset, starrail: starrailAsset } = new AssetFinder({
  language: "en",
});
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
app.use(express.json());

const db = "profiles";
const collection = "genshin_profiles";

const uri =
  "mongodb+srv://tjiang1472:Wnkzqp5FjvfflYFX@cluster0.49xpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
await client.connect();

app.get("/connection", async (req, res) => {
  const ping = await client.db("admin").command({ ping: 1 });
  const dbs = await client.db().admin().listDatabases();
  res.end(
    JSON.stringify({
      ping,
      dbs,
    })
  );
});

app.get("/findProfile/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await client
      .db(db)
      .collection(collection)
      .findOne({ uid: uid });
    if (!result) {
      res.send({ message: "No profiles found." });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500);
  }
});

app.put("/updateProfile/:uid", async (req, res) => {
  const { uid } = req.params;
  const { name } = req.body;

  try {
    const result = await client
      .db(db)
      .collection(collection)
      .findOne({ uid: uid });
    if (!result) {
      console.log(result);
      res.send({ message: "No profiles found." });
    } else {
      const test = await client
        .db(db)
        .collection(collection)
        .updateOne({ uid: uid }, { $set: { "playerInfo.username": name } });
      res.send({ message: `${uid} updated.` });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500);
  }
});

app.delete("/deleteProfile/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await client
      .db(db)
      .collection(collection)
      .findOne({ uid: uid });
    if (!result) {
      console.log(result);
      res.send({ message: "No profiles found." });
    } else {
      const tobedelete = await client
        .db(db)
        .collection(collection)
        .deleteOne({ uid: uid });
      res.send({ message: `${uid} deleted.` });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500);
  }
});

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
    res.status(500);
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
    .then(async (player) => {
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

      const sendData = {
        playerInfo,
        uid,
        namecard,
        characterData,
        profileUrl,
        stats,
      };

      const exist = await client
        .db(db)
        .collection(collection)
        .findOne({ uid: uid });
      if (!exist) {
        const result = await client.db(db).collection(collection).insertOne({
          playerInfo,
          uid,
          namecard,
          characterData,
          profileUrl,
          stats,
        });
        console.log("data does not exist");
      } else {
        console.log("exist");
      }

      res.send(sendData);
    })
    .catch((error) => {
      console.error("Error: ", error);
      res.status(500);
    });
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

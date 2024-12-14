import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [root, setRoot] = useState(false);
  const [backendData, setBackendData] = useState();
  const [input, setInput] = useState("");
  const [showInfo, setshowInfo] = useState(null);
  const [showStat, setShowStat] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.text())
      .then((message) => {
        if (message === "online") {
          console.log(message);
          setRoot(true);
        } else {
          console.log(message);
          setRoot(false);
        }
      });
  }, []);

  const threeStar = "⭐⭐⭐";
  const fourStar = "⭐⭐⭐⭐";
  const fiveStar = "⭐⭐⭐⭐⭐";

  const reset = () => {
    setBackendData();
    setshowInfo(null);
    setShowStat(null);
  };

  const showDetails = (char) => {
    setshowInfo(showInfo === char ? null : char);
    setShowStat(showStat === char ? null : char);
  };

  const submitInfo = async () => {
    const inputData = input;

    const result = await fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid: inputData }),
    });

    const resultinJson = await result.json();
    console.log(resultinJson);
    setBackendData(resultinJson);
    setInput("");
  };

  return (
    <div>
      {root && (
        <div>
          {backendData && (
            <div
              id="card"
              style={{
                backgroundImage: `url(${backendData.namecard})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div id="left">
                <div id="info">
                  <div id="playerInfo">
                    <div id="iden">
                      <div id="pfp">
                        <img src={backendData.profileUrl} />
                      </div>
                      <div id="nameUID">
                        <div>Name: {backendData.playerInfo.username}</div>
                        <div>UID: {backendData.uid}</div>
                      </div>
                    </div>
                    <div>Description: {backendData.playerInfo.signature}</div>
                    <br />
                    <div>AR: {backendData.playerInfo.levels.rank}</div>
                    <div>
                      Achievements: {backendData.playerInfo.achievements}
                    </div>
                  </div>
                  <div id="characterInfo">
                    {backendData.characterData.slice(0, 4).map(
                      (char, i) =>
                        showInfo === char && (
                          <div id="stats" className={char.element} key={i}>
                            <div>Stats</div>
                            <div>HP: {backendData.stats[i].maxHp.value}</div>
                            <div>ATK: {backendData.stats[i].atk.value}</div>
                            <div>DEF: {backendData.stats[i].def.value}</div>
                            <div>
                              Elemental Mastery:{" "}
                              {backendData.stats[i].elementalMastery.value}
                            </div>
                            <div>
                              Crit Rate:{" "}
                              {Math.round(
                                backendData.stats[i].critRate.value * 1000
                              ) / 10}
                              %
                            </div>
                            <div>
                              Crit Damage:{" "}
                              {Math.round(
                                backendData.stats[i].critDamage.value * 1000
                              ) / 10}
                              %
                            </div>
                            <div>
                              Energy Recharge:{" "}
                              {Math.round(
                                backendData.stats[i].energyRecharge.value * 1000
                              ) / 10}
                              %
                            </div>
                            {parseFloat(
                              backendData.stats[i].anemoDamageBonus.value
                            ) > 0 && (
                              <div>
                                Anemo DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].anemoDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].cryoDamageBonus.value
                            ) > 0 && (
                              <div>
                                Cryo DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].cryoDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].electroDamageBonus.value
                            ) > 0 && (
                              <div>
                                Electro DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].electroDamageBonus
                                    .value * 1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].geoDamageBonus.value
                            ) > 0 && (
                              <div>
                                Geo DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].geoDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].hydroDamageBonus.value
                            ) > 0 && (
                              <div>
                                Hydro DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].hydroDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].pyroDamageBonus.value
                            ) > 0 && (
                              <div>
                                Pyro DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].pyroDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].dendroDamageBonus.value
                            ) > 0 && (
                              <div>
                                Dendro DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].dendroDamageBonus.value *
                                    1000
                                ) / 10}
                                %
                              </div>
                            )}
                            {parseFloat(
                              backendData.stats[i].physicalDamageBonus.value
                            ) > 0 && (
                              <div>
                                Physical DMG Bonus:{" "}
                                {Math.round(
                                  backendData.stats[i].physicalDamageBonus
                                    .value * 1000
                                ) / 10}
                                %
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
              <div id="right">
                <div id="ccontainer">
                  {backendData.characterData.slice(0, 4).map((char, i) => (
                    <div id="characters" key={i}>
                      <div id="charName">
                        <img
                          onClick={() => showDetails(char)}
                          src={backendData.characterData[i].iconurl}
                        />
                        <div>{char.name}</div>
                      </div>
                      {showInfo === char && (
                        <div id="characterDetails" className={char.element}>
                          <div id="characterDetailsright">
                            <div>{char.element}</div>
                            <div>Level: {char.maxLevel}</div>
                            {char.stars === 3 && <div>{threeStar}</div>}
                            {char.stars === 4 && <div>{fourStar}</div>}
                            {char.stars === 5 && <div>{fiveStar}</div>}
                            <div>C{char.constellations.length}</div>
                          </div>
                          <div id="characterDetailsleft">
                            <div id="weapon">{char.weaponName}</div>
                            <img
                              className="weaponimg"
                              src={backendData.characterData[i].weaponImg}
                            ></img>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {backendData && <button id="reset" onClick={reset}></button>}
          {!backendData && <p>Enter Player UID</p>}
          {!backendData && (
            <input
              placeholder="Input UID"
              type="text"
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
          )}
          <br />
          {!backendData && (
            <button id="submit" onClick={submitInfo}>
              Submit
            </button>
          )}
        </div>
      )}
      {!root && <p>Loading</p>}
    </div>
  );
}

export default App;

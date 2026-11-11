import fs from "fs/promises";

const PLAYERS = [
  "tjafk",
  "_RiverDrift",
  "greenownscedar",
  "ItzJstMac",
  "elidaghost",
  "Sirr_Alonne",
  "timeweilder",
  "bigboyrayy",
  "Pluuto_fs",
  "CarbideMC"
];

async function fetchPlayer(username) {
  try {
    const response = await fetch(
      `https://pvphq.com/api/v1/players/by-name/${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      throw new Error(`${username} returned ${response.status}`);
    }

    const data = await response.json();

    const uuid = data.uuid;

    const ranks = {};

    if (Array.isArray(data.ranked)) {
      data.ranked.forEach(rank => {
        ranks[rank.gametypeName || rank.gametype] = rank.tier;
      });
    }

    return {
      username: data.name || username,
      uuid: data.uuid,
      points: data.overall?.points || 0,
      ranks
    };

  } catch (error) {
    console.error(`Failed to fetch ${username}:`, error);

    return {
      username: data.name || username,
      uuid: data.uuid,
      points: data.overall?.points || 0,
      ranks: {}
    };
  }
}

async function updateLeaderboard() {
  const players = await Promise.all(
    PLAYERS.map(fetchPlayer)
  );

  players.sort((a, b) => b.points - a.points);

  const stats = {
    lastUpdated: new Date().toUTCString(),
    players
  };

  await fs.writeFile(
    "stats.json",
    JSON.stringify(stats, null, 2)
  );

  console.log("stats.json updated!");
}

updateLeaderboard();
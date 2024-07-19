document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("allOwnedPlanets", (data) => {
    const planets = data.allOwnedPlanets || [];
    console.log("Retrieved planets data:", planets);
    const buttonsContainer = document.getElementById("buttons");
    const status = document.getElementById("status");

    if (planets.length === 0) {
      buttonsContainer.innerHTML = "No planets captured.";
    } else {
      planets.forEach((planet, index) => {
        const button = document.createElement("button");
        button.innerText = `Planet ${index + 1} copy`;
        button.onclick = () => {
          const tsvData = planetToTsv(planet);
          navigator.clipboard
            .writeText(tsvData)
            .then(() => {
              status.innerText = `Planet ${index + 1} data copied to clipboard!`;
            })
            .catch((error) => {
              console.error("Error copying TSV data:", error);
              status.innerText = `Failed to copy Planet ${index + 1} data.`;
            });
        };
        buttonsContainer.appendChild(button);
      });
    }
  });
});

function planetToTsv(planet) {
  const fields = [
    "iron",
    "coal",
    "steel",
    "tritium",
    "gold",

    "solar_power",
    "coal_power",
    "wind_power",
    "tritium_power",
    "wood_cutter",
    "iron_mine",
    "gold_mine",
    "blast_furnace",
    "industrial_food",
    "income_facility",
    "carbon_absorbers",
    "defense_dome",
    "gap_generator",
    "widowmine_charger",
    "giga_factory",
    "tritium_batteries",
    "energy_core",
    "turn_generator",
    "turn_storage",

    "farmers",
    "doctors",
    "industrial_workers",
    "commercial_workers",
    "mine_workers",
    "engineers",
    "scientists",
    "factory_workers",
    "mine_slaves",
    "teachers",
    "professors",
    "tacticians",
    "spys",
    "assassins",
    "security_officers",
    "attack_soldiers",
    "attack_corporals",
    "attack_majors",
    "attack_champions",
    "defensive_soldiers",
    "defensive_corporals",
    "defensive_majors",
    "defensive_champions",
  ];

  const nestedFields = {
    ships: [],
    work_percentage: [
      "solar_power",
      "coal_power",
      "wind_power",
      "tritium_power",
      "wood_cutter",
      "iron_mine",
      "gold_mine",
      "blast_furnace",
      "industrial_food",
      "income_facility",
      "carbon_absorbers",
      "defense_dome",
      "gap_generator",
      "widowmine_charger",
      "giga_factory",
      "tritium_batteries",
      "energy_core",
      "turn_generator",
      "turn_storage",
    ],
    skills: [
      "farmializm",
      "industrializm",
      "commercializm",
      "economy",
      "mining",
      "iron",
      "gold",
      "tritium_mining",
      "metallurgy",
      "practices",
      "energy",
      "solar",
      "tritium_power",
      "medicane",
      "forestry",
      "botany",
      "computers",
      "colonization",
      "entertainment",
      "ironized_gold",
    ],
  };

  // Extract dynamic keys from ships if they are not predefined
  if (planet.ships) {
    nestedFields.ships = Object.keys(planet.ships);
  }

  const replacer = (key, value) => (value === null ? "" : value);

  let tsv = fields
    .map((field) => {
      const value = getNestedValue(planet, field);
      return `${field}\t${JSON.stringify(value, replacer)}`;
    })
    .join("\n");

  // Add nested fields data
  for (const [key, subfields] of Object.entries(nestedFields)) {
    tsv += "\n";
    tsv += subfields
      .map((subfield) => {
        const value = getNestedValue(planet[key], subfield);
        return `${key}.${subfield}\t${JSON.stringify(value, replacer)}`;
      })
      .join("\n");
  }

  return tsv;
}

function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

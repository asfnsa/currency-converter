const base_url = `https://latest.currency-api.pages.dev/v1/currencies`;
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn");
const fromcurr = document.getElementById("from");
const tocurr = document.getElementById("to");
const svg = document.querySelector(".svg")

for (const select of dropdown) {
  countryList.forEach((countycode) => {
    const currcode = countycode.code;
    const code3 = countycode.currency;
    let newOption = document.createElement("option");

    newOption.innerText = countycode.name;
    newOption.value = currcode;
    newOption.id = code3; // ⭐ Yahan set kiya code3 as id

    select.append(newOption);

    if (select.name === "from" && currcode === "US") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currcode === "IN") {
      newOption.selected = "selected";
    }

    // Flag update listener
    select.addEventListener("change", (evt) => {
      upadateflag(evt.target);
    });
  });
}

const upadateflag = (element) => {
  let flagcode = element.value;
  let newsrc = `https://flagsapi.com/${flagcode}/shiny/64.png`;
  const flagimg = element.parentElement.querySelector("img");
  if (flagimg) {
    flagimg.src = newsrc;
  }
};
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  // Amount validate karo
  let amount = document.querySelector(".amountval input");
  let amountval = amount.value;
  if (amountval === "" || amountval < 1) {
    amountval = 1;
    amount.value = "1";
  }

  // From & To dropdown se selected <option>
  const fromSelected = fromcurr.selectedOptions[0];
  const toSelected = tocurr.selectedOptions[0];

  // Value = 2-letter code (e.g., US), ID = 3-letter code (e.g., USA)
  const fromCode = fromSelected.value; // "US"
  const toCode = toSelected.value; // "IN"
  const fromCode3 = fromSelected.id; // "USA"
  const toCode3 = toSelected.id; // "IND"

  // 🟡 API Call
  const url = `${base_url}/${fromCode3.toLowerCase()}.json`; // e.g., https://.../us.json
  const response = await fetch(url);
  const data = await response.json();

  // 🔍 Conversion rate nikaalo
  const rate = data[fromCode3.toLowerCase()][toCode3.toLowerCase()];
  const convertedAmount = (amountval * rate).toFixed(2);

  // 🎯 Update result text
  const msg = document.querySelector(".msg");
  msg.innerText = `${amountval} ${fromCode3} = ${convertedAmount} ${toCode3}`;


  svg.addEventListener("click", (evt) =>{
    let first = fromcurr.value;
    fromcurr.value = tocurr.value;
    tocurr.value = first;

    upadateflag(fromcurr);
    upadateflag(tocurr);

    btn.click();
  })
});

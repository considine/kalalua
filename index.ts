import puppeteer from "https://deno.land/x/puppeteer@9.0.1/mod.ts";
const sleep = (timeout = 2000) =>
  new Promise((res) => setTimeout(res, timeout));

const goTime = 1626602400000;

const openTime = goTime - 10 * 1000 * 60;

(async () => {
  const username = Deno.env.get("HAWAII_USERNAME") ?? "";
  if (username.length === 0) {
    throw new Error("You must set the `HAWAII_USERNAME` environment variable!");
  }

  const password = Deno.env.get("HAWAII_PASSWORD") ?? "";
  if (username.length === 0) {
    throw new Error("You must set the `HAWAII_PASSWORD` environment variable!");
  }

  await sleep(openTime - new Date().getTime());

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  const timeToGo = new Date().getTime() + 1000 * 125;

  for (let i = 0; i < 10; i++) {
    const adjustedTimeToGoSpread = timeToGo - 100 + i * 20; // 100ms before midnight +

    const browser = await puppeteer.launch({
      headless: false,
    });

    const newPage = await browser.newPage();
    await newPage.setViewport({ width: 1366, height: 768 });

    await newPage.goto(
      "https://camping.ehawaii.gov/camping/spc,details,1692.html"
    );

    await newPage.goto(
      "https://login.ehawaii.gov/lala/login?service=https%3A%2F%2Fcamping.ehawaii.gov%2Fcamping%2Fj_spring_cas_security_check"
    );
    await newPage.type("#username", username, {
      delay: 50,
    });
    await newPage.type("#password", password, {
      delay: 50,
    });

    console.log("Submitting", i);

    await newPage.click("button[type=submit]");

    await newPage.waitForNavigation({
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    try {
      await newPage.waitForSelector("#makeReservationButton");
      await newPage.click("#makeReservationButton");
    } catch (error) {}

    i > 0 && (await sleep(2000));

    await newPage.focus("#event_checkIn");
    await newPage.evaluate((x) => {
      x.value = "08/16/2021";
    }, "#event_checkOut");

    await sleep(100);
    await newPage.type("#event_checkIn", "08/17/2021", {
      delay: 100,
    });
    await newPage.focus("#event_checkOut");
    await sleep(3000);

    await newPage.type("#event_adultsNo", "4", {
      delay: 100,
    });

    await newPage.focus("#event_checkOut");
    await sleep(100);
    await newPage.type("#event_checkOut", "08/18/2021", {
      delay: 100,
    });

    await newPage.select("#site_ids", "140");

    // In a timeout click the continue button
    setTimeout(async () => {
      console.log("CLicking page", i);
      await newPage.click("#continueButton");
      await sleep(10000);
      //   Just for a record on whether this scraper got it
      await newPage.screenshot({ path: `output/continue-${i}.png` });
    }, adjustedTimeToGoSpread - new Date().getTime());
  }

  //   keep this open for 24 hours

  await sleep(100000);

  await browser.close();
})();

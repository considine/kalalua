# Hawaii

## Deno

This code uses the [Deno runtime](https://deno.land/#installation). It runs JavaScript like Nodejs, but doesn't uses node_modules, includes a more expansive core in the `Deno` variable, supports TypeScript out of the box, and can compile codebases into single executables.

See the above for installation.

## Function

This logic opens up 10 different browser windows 10 minutes before `goTime`- so make sure to set that to the ms epoch timestamp of 12am Hawaii Standard Time the day of ticketing. At `goTime` exactly each browser submits the registration form. In fact, there's a little bit of variance; the first submits 100ms before, the second 80ms before etc. Obviously it will take a few ms for this request to get to the Hawaii gov server so providing a spread might increase the odds of being the first valid submission.

## Code

```bash
deno run --unstable --allow-env --allow-write --allow-read --allow-run --allow-net index.ts
```

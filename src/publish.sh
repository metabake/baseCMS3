# zip up the sample apps, update Base.ts version
# ncu -u
tsc
node mbake.js
npm publish
#sudo yarn global add  mbake --unsafe-perm=true --allow-root

# if changed node version do this:
# sudo yarn global remove mbake-x

mbake
yarn global add mbake
mbake

# also update https://github.com/metabake/mBakeCli/blob/master/docs/versions.yaml

# find . -type f -name 'package-lock.json' 
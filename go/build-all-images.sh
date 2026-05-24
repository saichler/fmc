set -e
cd ./fmc/log-vnet/
./build.sh
cd ../vnet/
./build.sh
cd ../main
./build.sh
cd ../ui
./build.sh
cd ../member-ui
./build.sh

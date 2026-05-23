set -e
cd ./fmc/vnet/
./build.sh
cd ../main
./build.sh
cd ../ui
./build.sh
cd ../member-ui
./build.sh

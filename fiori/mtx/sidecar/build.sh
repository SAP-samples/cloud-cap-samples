sidecar=mtx/sidecar
out=$sidecar/gen

# Build sidecar frame -> mtx/sidecar/gen
# cds build mtx/sidecar --for node-cf --out $out
cd $sidecar
mkdir srv
CDS_BUILD_TARGET=ttt cds build --for node-cf
rm -r srv
rm -fr gen
mv ttt/srv gen
rm -r ttt
cd ../..

# Add main app's models -> mtx/sidecar/gen/_main
# cds build --out $out/_main --for node-cf
mkdir srv
cds build --for node-cf
rm -r srv
mv gen/srv $out/_main

# Add archive of main app's resources -> mtx/sidecar/gen/_main/resources.tgz
# cds build --out .tmp --for hana && cd .tmp/gen/db && tar czfv ../../$out/_main/resource.tgz *
cds build --for hana && cd gen/db && tar czfv ../../$out/_main/resource.tgz *


node graph.js &

nodepid=$!

echo "node pid: $nodepid"

sleep 1

dtrace -n 'profile-97/pid == '$nodepid' && arg1/{ @[jstack(150, 8000)] = count(); } tick-30s { exit(0); }' > dump.src

kill $nodepid

echo "done"

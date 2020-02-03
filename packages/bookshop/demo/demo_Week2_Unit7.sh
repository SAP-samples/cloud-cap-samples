#!/usr/bin/env bash

########################
# include the magic
########################
. ./demo-magic.sh


########################
# Configure the options
########################

#
# speed at which to simulate typing. bigger num = faster
#
TYPE_SPEED=30

#
# custom prompt
#
# see http://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/bash-prompt-escape-sequences.html for escape sequences
#
DEMO_PROMPT='\[\033[33;1m\]${PWD#"${PWD%/*/*}/"} \[\033[m\]\$ '

# DEMO_PROMPT='${PWD#"${PWD%/*/*}/"} $ '

# DEMO_PROMPT="${CYAN}➜ ${GREEN} ${PWD#"${PWD%/*/*}/"} $"



# hide the evidence
clear

p "Demo: Week 2 Unit 7 Testing"

pe "cd .."

p "How Javascript testing framework Jest helps to run test"
p "Take a look at the example test/bookshop.test.js"
p "Now run the test"
pe " cd ../.. && npm run test bookshop"

p " Enable debug switch for CDS and run a few tests with Rest Client tool"
pe "cd packages/bookshop"
pe "DEBUG=true PORT=4004 cds run --in-memory "


e "pkill node"
# the demo has concluded
p ""
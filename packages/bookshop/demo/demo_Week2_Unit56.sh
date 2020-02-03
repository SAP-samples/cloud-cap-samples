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

p "Demo: Week 2 Unit 5 Custom Handlers & Unit 6 Access Data From Code"

pe "cd .."

p "First check srv.before and srv.after in bookshop/srv/cat-service.js. \n"

p "  - srv.after   : apply discount in case of overstock in case of READ entity Books \n"

p "  - srv.before  : ensure sufficient stock in case of CREATE Orders \n"

# p "  - srv.on      : call external review services in case of READ entity Reviews \n"

p "Now launch Bookshop, and run a few tests in VSCode. \n"


# pe "PORT=4004 cds run reviews-service --in-memory & "
pe "PORT=4004 cds run --in-memory "


e "pkill node"
# the demo has concluded
p ""
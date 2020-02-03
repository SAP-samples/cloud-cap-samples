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

p "Demo: Week 2 Unit 4 Using Database"

pe "cd ../"

p "********************************"
p "Demo 4.1: Deploy to your data to different database"

p "  let's check model definition in schema.cds in VSCode"

p "  let's check CSV files"
pe "ls -l db/data"

p "As the quickest option to get started, you can deploy your data to in-memory SQLite database"
p "cds run --in-memory"
e "cds run --in-memory | grep --color=always -E '^.*in-memory.*$' -C 10000"
#pe "cds run --in-memory | grep --color=always -E '^.*in-memory.*$' -C 10000"

p " Typically you might also start your project locally and choose to deploy the CSV files to local SQLite database file"
p "cds deploy --to sqlite:bookshop.db"
e "cds deploy --to sqlite:bookshop.db | grep --color=always -E '^.*successfully.*$' -C 10000"

p "  the package.json file is udpated accordingly"

p "cat package.json"
e "cat package.json | grep --color -E bookshop.db -C 10000 "

p "Inspect database schema with sqlite cli or VSCode extension"

p  "sqlite3 bookshop.db .tables "
e  "sqlite3 bookshop.db .tables | grep -v localized"

pe "sqlite3 bookshop.db \".schema sap_capire_bookshop_Authors \""

p  "sqlite3 bookshop.db \".schema sap_capire_bookshop_Books \" "
e  "sqlite3 bookshop.db \".schema sap_capire_bookshop_Books \"  | grep --color -E author_ID -C 10000"
#  author_ID INTEGER, 


p "Or deploy to HANA database in Cloud Foundry (logged in Cloud Foundry already)"

pe "cds deploy --to hana"

# highlight the first hana in the output
p "cat default-env.json | less"
e "cat default-env.json | grep --color=always -E "^.*\"hana\".*$" -C 10000 | less"


p "Behind the scene,  cds CLI compiles the cds model definition and looks up corrsponding CSV files for each table"
p "Check out the gen/src folder in VSCode"

p "cds compile  --to hdbtabledata db/schema.cds"
e "cds compile  --to hdbtabledata db/schema.cds | grep --color=always 'target_table\|source_data\|column_mappings'  -C 10000 | less"

p "********************************"

p "Q: How CDS model maps to SQL ?"
p "cds compile --to sql db/schema.cds"
e "cds compile --to sql db/schema.cds | grep --color=always -E '^.*CREATE TABLE.*$'  -C 10000 | less"

p "cds compile --to hana db/schema.cds"
e "cds compile --to hana db/schema.cds | grep --color=always -E '^.*entity.*$'  -B 4 -A 50 | less"


# Following part will demostrated in later units
# p "Q: How annotation @cds.persistence.exist works? "
# pe "cat db/schema.cds | grep --color -E 'cds.persistence.exists|$' "
# p "It denotes that there already exists a native database object, and should be used during runtime."
# p "The CDS artifact merely acts as a proxy artifact, representing the signature of the native database artifact in the CDS model."
# pe "cds compile --to sql db/schema.cds | grep --color -E ISBN -A 5"

# p "Now removing annotation @cds.persistence.exist and check again"
# pe "cds compile --to sql db/schema.cds | grep --color -E ISBN -A 5"


# p "Q: How annotation @cds.persistence.skip works? "
# pe "cat srv/services.cds | grep --color -E cds.persistence.skip -A 5 -B 5"
# p "It denotes that the artifact isn't available in the database but eventually implemented by custom code."

# pe "cds compile  --to serviceinfo srv/services.cds"

# the demo has concluded
p ""
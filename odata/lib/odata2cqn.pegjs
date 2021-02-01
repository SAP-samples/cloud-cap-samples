/** ------------------------------------------
 * This is a peg.js adaptation of the https://github.com/oasis-tcs/odata-abnf/blob/master/abnf/odata-abnf-construction-rules.txt
 * which directly constructs CQN out of parsed sources.
 *
 * NOTE:
 * In contrast to the OData ABNF source, which uses very detailedsemantic rules,
 * this adaptation uses rather generic syntactic rules only, e.g. not distinguishing
 * betwenn Collection Navigation or not knowing individual function names.
 * This is to be open to future enhancements of the OData standard, as well as
 * to improve error messages. For example a typo in a function name could be
 * reported specifically instead of throwing a generic parser error.
 *
 * Future test cases http://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/abnf/odata-abnf-testcases.xml
 *
 * Limitations: Type, Geo functions are not supported,
 * maxdatetime, mindatetime, fractionalseconds,
 * totaloffsetminutes, date, totalseconds,
 * floor, ceiling also are not supported by CAP
 *
 * Examples:
 * Books
 * Books/201
 * Books?$select=ID,title&$expand=author($select=name)&$filter=stock gt 1&$orderby=title
 */

// ---------- JavaScript Helpers -------------
	{
		const stack=[]
		let SELECT
	}

// ---------- Entity Paths ---------------

	ODataRelativeURI // Note: case-sensitive!
		= (p:path { SELECT = { from:p } })
		( o"?"o QueryOption ( o'&'o QueryOption )* )? {
			if (SELECT.expand) {
				SELECT.columns = SELECT.expand
				delete SELECT.expand
			}
			return { SELECT }
		}

	path
		= crv:$("$count"/"$ref"/"$value") {return {ref:[crv]}}
		/ head:identifier filter:(OPEN args CLOSE)? tail:( '/' p:path {return p} )? {
			const ref = [ filter ? { id:head, where:filter[1] } : head ]
			if (tail) ref.push (...tail.ref)
			return {ref}
		}

	args
		= val:( number / integer / string ) {return [{val}]}
		/ ref:identifier o"="o val:( number / integer / string ) more:( COMMA args )? {
			const args = [ {ref}, '=', {val} ]
			if (more) args.push ('and', ...more[1])
			return args
		}

	ref "a reference"
		= head:identifier tail:( '/' identifier )* {
			return { ref:[ head, ...tail ] }
		}

 //
// ---------- Query Options ------------

	QueryOption = ExpandOption
	ExpandOption =
		"$select="  		o select ( COMMA select )* /
		"$expand="  		o expand ( COMMA expand )* /
		"$filter="  		o filter /
		"$orderby=" 		o orderby /
		"$top="     		o top /
		"$skip="    		o skip /
		"$search=" 			o search /
		"$count=" 			o count

	select
		= col:ref {
			(SELECT.expand || (SELECT.expand = [])).push(col)
			return col
		}

	expand =
		( c:select {c.expand='*'} )
		( // --- nested query options, if any
			(OPEN {
				stack.push (SELECT)
				SELECT = SELECT.expand[SELECT.expand.length-1]
				SELECT.expand = []
			})
			ExpandOption ( o";"o ExpandOption )*
			(CLOSE {
				SELECT = stack.pop()
			})
		)? // --- end of nested query options
		( COMMA expand )?

	top
		= val:integer {
			(SELECT.limit || (SELECT.limit={})).rows = {val}
		}

	skip
		= val:integer {
			(SELECT.limit || (SELECT.limit={})).offset = {val}
		}

	search
		= p:search_clause {SELECT.search = p}
		search_clause = p:( n:NOT? {return n?[n]:[]} )(
			OPEN xpr:search_clause CLOSE {p.push({xpr})}
			/ val:(identifier/string) {p.push({val})}
		)( ao:(AND/OR) more:search_clause {p.push(ao,...more)} )*
		{return p}

	filter
		= p:where_clause {SELECT.where = p}
		where_clause = p:( n:NOT? {return n?[n]:[]} )(
			OPEN xpr:where_clause CLOSE {p.push({xpr})}
			/ comp:comparison {p.push(...comp)}
			/ func:boolish {p.push(func)}
		)( ao:(AND/OR) more:where_clause {p.push(ao,...more)} )*
		{return p}

	orderby
		= ref:ref sort:( _ s:$("asc"/"desc") {return s})? {
			SELECT.orderby = $(ref, sort && {sort})
		}

	count
		= c:$[^,?&()]+ { SELECT.count = true }

 //
// ---------- Expressions ------------


	comparison "a comparison"
		= a:operand _ o:$("eq"/"ne"/"lt"/"gt"/"le"/"ge") _ b:operand {
			const op = { eq:'=', ne:'!=', lt:'<', gt:'>', le:'<=', ge:'>=' }[o]||o
			return [ a, op, b ]
		}

	operand "an operand"
		= val:number {return Number.isSafeInteger(val) ? {val} : { val:String(val), literal:'number' }}
		/ val:string {return {val}}
		/ function
		/ ref

	function "a function call"
		= func:$[a-z]+ OPEN a:operand more:( COMMA o:operand {return o} )* CLOSE
		{ return { func, args:[a,...more] }}

	boolish "a boolean function"
		= func:("contains"/"endswith"/"startswith") OPEN a:operand COMMA b:operand CLOSE
		{ return { func, args:[a,b] }}

	NOT = o "not"i _ {return 'not'}
	AND = _ "and"i _ {return 'and'}
	OR  = _  "or"i _ {return 'or'}


 //
// ---------- Literals -----------

	string "Edm.String"
		= "'" s:$("''"/[^'])* "'"
		{return s.replace(/''/g,"'")}

	number
		= x:$( [+-]? [0-9]+ ("."[0-9]+)? ("e"[0-9]+)? )
		{return Number(x)}

	integer
		= x:$( [+-]? [0-9]+ )
		{return parseInt(x)}

	identifier
		= $([a-zA-Z][_a-zA-Z0-9]*)


 //
// ---------- Punctuation ----------

	COLON = o":"o
	COMMA = o","o
	SEMI  = o";"o
	OPEN  = o"("o
	CLOSE = o")"

 //
// ---------- Whitespaces -----------

	o "optional whitespaces" = $[ \t\n]*
	_ "mandatory whitespaces" = $[ \t\n]+

 //
// ------------------------------------

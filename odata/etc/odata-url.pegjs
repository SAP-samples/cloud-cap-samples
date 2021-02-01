//------------------------------------------------------------------------------
// odata-abnf-construction-rules
//------------------------------------------------------------------------------
//
//     OData Version 4.0 Plus Errata 03
//     OASIS Standard incorporating Approved Errata 03
//     02 June 2016
//     Copyright (c) OASIS Open 2016. All Rights Reserved.
//     Source: http://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/abnf/
//     Link to latest version of narrative specification: http://docs.oasis-open.org/odata/odata/v4.0/errata03/odata-v4.0-errata03-part1-protocol-complete.html
//
//   Technical Committee:
//   OASIS Open Data Protocol (OData) TC
//   https://www.oasis-open.org/committees/odata
//
// Chairs:
//   - Barbara Hartel (barbara.hartel@sap.com), SAP SE
//   - Ram Jeyaraman (Ram.Jeyaraman@microsoft.com), Microsoft
//
// Editors:
//   - Ralf Handl (ralf.handl@sap.com), SAP SE
//   - Michael Pizzo (mikep@microsoft.com), Microsoft
//   - Martin Zurmuehl (martin.zurmuehl@sap.com), SAP SE
//
// Additional artifacts:
//   This grammar is one component of a Work Product which consists of:
//   - OData Version 4.0 Part 1: Protocol
//   - OData Version 4.0 Part 2: URL Conventions
//   - OData Version 4.0 Part 3: Common Schema Definition Language (CSDL)
//   - OData ABNF Construction Rules Version 4.0 (this document)
//   - OData ABNF Test Cases
//   - OData Core Vocabulary
//   - OData Capabilities Vocabulary
//   - OData Measures Vocabulary
//   - OData Metadata Service Entity Model
//   - OData EDMX XML Schema
//   - OData EDM XML Schema
//
// Related work:
//   This work product is related to the following two Work Products, each of
//   which define alternate formats for OData payloads
//   - OData Atom Format Version 4.0
//   - OData JSON Format Version 4.0
//   This specification replaces or supersedes:
//   - None
//
// Declared XML namespaces:
//   - http://docs.oasis-open.org/odata/ns/edmx
//   - http://docs.oasis-open.org/odata/ns/edm
//
// Abstract:
//   The Open Data Protocol (OData) enables the creation of REST-based data
//   services, which allow resources, identified using Uniform Resource
//   Identifiers (URLs) and defined in a data model, to be published and
//   edited by Web clients using simple HTTP messages. This document defines
//   the URL syntax for requests and the serialization format for primitive
//   literals in request and response payloads.
//
// Overview:
//   This grammar uses the ABNF defined in RFC5234 with one extension: literals
//   enclosed in single quotes (e.g. '$metadata') are treated case-sensitive.
//
//   The following rules assume that URIs have been percent-encoding normalized
//   as described in section 6.2.2.2 of RFC3986
//   (http://tools.ietf.org/html/rfc3986#section-6.2.2.2)
//   before applying the grammar to them, i.e. all characters in the unreserved
//   set (see rule "unreserved" below) are plain literals and NOT
//   percent-encoded.
//
//   For characters outside the unreserved set the rules explicitly state
//   whether the percent-encoded representation is treated identical to the
//   plain literal representation.
//
//   One prominent example is the single quote that delimits OData primitive
//   type literals: %27 and ' are treated identically, so a single quote within
//   a string literal is "encoded" as two consecutive single quotes in either
//   literal or percent-encoded representation.
//
// Contents:
//   1. Resource Path
//   2. Query Options
//   3. Context URL Fragments
//   4. Expressions
//   5. JSON format for function parameters
//   6. Names and identifiers
//   7. Literal Data Values
//   8. Header values
//   9. Punctuation
//
//   A. URI syntax [RFC3986]
//   B. IRI syntax [RFC3986]
//   C. ABNF core definitions [RFC5234]
//

{
	const $=Object.assign
	const stack=[]
	let SELECT, columns

	const select = (col) => {
		if (!columns) columns = SELECT.columns = []
		columns.push(col)
	}
	const expand = (col) => {
		select (col)
		stack.push (SELECT)
		SELECT = col
		columns = col.expand = []
	}
	const end = () => {
		if (columns.length === 0) columns.push('*')
		SELECT = stack.pop()
		columns = SELECT.columns || SELECT.expand
	}
	const limit = (o) => {
		$(SELECT.limit || (SELECT.limit={}), o)
	}
	const functions = {
		toupper: 'upper',
		tolower: 'lower',
		indexof: 'locate',
		time: 'to_time',
	}
	const comparators = {
		eq: '=',
		ne: '!=',
		lt: '<',
		gt: '>',
		le: '<=',
		ge: '>=',
	}

}

//------------------------------------------------------------------------------
dummyStartRule = odataRelativeUri // just to please the test parser
//------------------------------------------------------------------------------


// odataUri = serviceRoot ( odataRelativeUri )?

// serviceRoot = ( "https" / "http" )                    // Note: case-insensitive
//              "://" [^:]+ ( ":" DIGIT+ )?
//              "/" ( [^/]+ "/" )*

odataRelativeUri = '$batch'                           // Note: case-sensitive!
                 / '$entity' "?" entityOptions
                 / '$entity' "/" qualifiedEntityTypeName "?" entityCastOptions
                 / '$metadata' ( "?" format )? ( context )?
                 / resourcePath ( "?" queryOptions )?


//------------------------------------------------------------------------------
// 1. Resource Path
//------------------------------------------------------------------------------

resourcePath = entitySetName                  ( collectionNavigation )?
             / singletonEntity                ( singleNavigation )?
             / actionImportCall
             / entityColFunctionImportCall    ( collectionNavigation )?
             / entityFunctionImportCall       ( singleNavigation )?
             / complexColFunctionImportCall   ( complexColPath )?
             / complexFunctionImportCall      ( complexPath )?
             / primitiveColFunctionImportCall ( primitiveColPath )?
             / primitiveFunctionImportCall    ( primitivePath )?
             / crossjoin
             / '$all'                         ( "/" qualifiedEntityTypeName )?

collectionNavigation = ( "/" qualifiedEntityTypeName )? ( collectionNavPath )?
collectionNavPath    = keyPredicate ( singleNavigation )?
                     / boundOperation
                     / count
                     / ref

keyPredicate     = simpleKey / compoundKey // / keyPathSegments
simpleKey        = OPEN ( parameterAlias / keyPropertyValue ) CLOSE
compoundKey      = OPEN keyValuePair ( COMMA keyValuePair )* CLOSE
keyValuePair     = ( primitiveKeyProperty / keyPropertyAlias  ) EQ ( parameterAlias / keyPropertyValue )
keyPropertyValue = primitiveLiteral
keyPropertyAlias = odataIdentifier
//keyPathSegments  = ( "/" keyPathLiteral )+
//keyPathLiteral   = pchar*

singleNavigation = ( "/" qualifiedEntityTypeName )?
                   ( "/" propertyPath
                      / boundOperation
                      / ref
                      / value  // request the media resource of a media entity
                   )?

propertyPath = entityColNavigationProperty ( collectionNavigation )?
             / entityNavigationProperty    ( singleNavigation )?
             / complexColProperty          ( complexColPath )?
             / complexProperty             ( complexPath )?
             / primitiveColProperty        ( primitiveColPath )?
             / primitiveProperty           ( primitivePath )?
             / streamProperty              ( boundOperation )?

primitiveColPath = count / boundOperation

primitivePath  = value / boundOperation

complexColPath = ( "/" qualifiedComplexTypeName )?
                 ( count / boundOperation )?

complexPath    = ( "/" qualifiedComplexTypeName )?
                 ( "/" propertyPath
                 / boundOperation
                 )?

count = '/$count'
ref   = '/$ref'
value = '/$value'

// boundOperation segments can only be composed if the type of the previous segment
// matches the type of the first parameter of the action or function being called.
// Note that the rule name reflects the return type of the function.
boundOperation = "/" ( boundActionCall
                     / boundEntityColFunctionCall    ( collectionNavigation )?
                     / boundEntityFunctionCall       ( singleNavigation )?
                     / boundComplexColFunctionCall   ( complexColPath )?
                     / boundComplexFunctionCall      ( complexPath )?
                     / boundPrimitiveColFunctionCall ( primitiveColPath )?
                     / boundPrimitiveFunctionCall    ( primitivePath )?
                     )

actionImportCall = actionImport
boundActionCall  = namespace "." action
                   // with the added restriction that the binding parameter MUST be either an entity or collection of entities
                   // and is specified by reference using the URI immediately preceding (to the left) of the boundActionCall

// The following boundXxxFunctionCall rules have the added restrictions that
//  - the function MUST support binding, and
//  - the binding parameter type MUST match the type of resource identified by the
//    URI immediately preceding (to the left) of the boundXxxFunctionCall, and
//  - the functionParameters MUST NOT include the bindingParameter.
boundEntityFunctionCall       = namespace "." entityFunction       functionParameters
boundEntityColFunctionCall    = namespace "." entityColFunction    functionParameters
boundComplexFunctionCall      = namespace "." complexFunction      functionParameters
boundComplexColFunctionCall   = namespace "." complexColFunction   functionParameters
boundPrimitiveFunctionCall    = namespace "." primitiveFunction    functionParameters
boundPrimitiveColFunctionCall = namespace "." primitiveColFunction functionParameters

entityFunctionImportCall       = entityFunctionImport       functionParameters
entityColFunctionImportCall    = entityColFunctionImport    functionParameters
complexFunctionImportCall      = complexFunctionImport      functionParameters
complexColFunctionImportCall   = complexColFunctionImport   functionParameters
primitiveFunctionImportCall    = primitiveFunctionImport    functionParameters
primitiveColFunctionImportCall = primitiveColFunctionImport functionParameters

functionParameters = OPEN ( functionParameter ( COMMA functionParameter )* )? CLOSE
functionParameter  = parameterName EQ ( parameterAlias / primitiveLiteral )
parameterName      = odataIdentifier
parameterAlias     = AT odataIdentifier

crossjoin = '$crossjoin' OPEN
            entitySetName ( COMMA entitySetName )*
            CLOSE


//------------------------------------------------------------------------------
// 2. Query Options
//------------------------------------------------------------------------------

queryOptions = queryOption ( "&" queryOption )*
queryOption  = systemQueryOption
             / aliasAndValue
             / customQueryOption

entityOptions  = ( entityIdOption "&" )* id ( "&" entityIdOption )*
entityIdOption = format
               / customQueryOption
entityCastOptions = ( entityCastOption "&" )* id ( "&" entityCastOption )*
entityCastOption  = entityIdOption
                  / expand
                  / select

id = '$id' EQ $[^&]+ // was: IRI-in-query

systemQueryOption = deltatoken
                  / expand
                  / filter
                  / format
                  / id
                  / inlinecount
                  / orderby
                  / search
                  / select
                  / skip
                  / skiptoken
                  / top

expand            = '$expand' EQ expandItem ( COMMA expandItem )*
expandItem        = STAR ( ref / OPEN levels CLOSE )?
                  / expandPath
                    ( ref   ( OPEN expandRefOption   ( SEMI expandRefOption   )* CLOSE )?
                    / count ( OPEN expandCountOption ( SEMI expandCountOption )* CLOSE )?
                    /         OPEN expandOption      ( SEMI expandOption      )* CLOSE
                    )?
expandPath        = ( ( qualifiedEntityTypeName / qualifiedComplexTypeName ) "/" )?
                    ( ( complexProperty / complexColProperty ) "/" ( qualifiedComplexTypeName "/" )? )*
                    ( STAR / navigationProperty ( "/" qualifiedEntityTypeName )? )
expandCountOption = filter
                  / search
expandRefOption   = expandCountOption
                  / orderby
                  / skip
                  / top
                  / inlinecount
expandOption      = expandRefOption
                  / select
                  / expand
                  / levels

levels = '$levels' EQ ( oneToNine *DIGIT / 'max' )

filter = '$filter' EQ boolCommonExpr

orderby     = '$orderby' EQ orderbyItem ( COMMA orderbyItem )*
orderbyItem = commonExpr ( RWS ( 'asc' / 'desc' ) )?

skip = '$skip' EQ DIGIT*
top  = '$top'  EQ DIGIT*

format = '$format' EQ
         ( "atom"
         / "json"
         / "xml"
         / pchar* "/" pchar* // <a data service specific value indicating a
         )                     // format specific to the specific data service> or
                               // <An IANA-defined [IANA-MMT] content type>

inlinecount = '$count' EQ booleanValue

search     = '$search' EQ BWS searchExpr
searchExpr = ( OPEN BWS searchExpr BWS CLOSE
             / searchTerm
             ) ( searchOrExpr
               / searchAndExpr
               )?

searchOrExpr  = RWS 'OR'  RWS searchExpr
searchAndExpr = RWS ( 'AND' RWS )? searchExpr

searchTerm   = ( 'NOT' RWS )? ( searchPhrase / searchWord )
searchPhrase = quotation_mark ( !DQUOTE qchar_no_AMP )+ quotation_mark
searchWord   = ALPHA+ // Actually: any character from the Unicode categories L or Nl,
                       // but not the words AND, OR, and NOT

select         = '$select' EQ selectItem ( COMMA selectItem )*
selectItem     = STAR
               / allOperationsInSchema
               / ( ( qualifiedEntityTypeName / qualifiedComplexTypeName ) "/" )?
                 ( selectProperty
                 / qualifiedActionName
                 / qualifiedFunctionName
                 )
selectProperty = primitiveProperty
               / primitiveColProperty
               / navigationProperty
               / selectPath ( "/" selectProperty )?
selectPath     = ( complexProperty / complexColProperty ) ( "/" qualifiedComplexTypeName )?


allOperationsInSchema = namespace "." STAR

// The parameterNames uniquely identify the bound function overload
// only if it has overloads.
qualifiedActionName   = namespace "." action
qualifiedFunctionName = namespace "." function ( OPEN parameterNames CLOSE )?

// The names of all non-binding parameters, separated by commas
parameterNames = parameterName ( COMMA parameterName )*

deltatoken = '$deltatoken' EQ qchar_no_AMP+

skiptoken = '$skiptoken' EQ qchar_no_AMP+

aliasAndValue = parameterAlias EQ parameterValue

parameterValue = arrayOrObject
               / commonExpr

customQueryOption = customName ( EQ customValue )?
customName        = !EQ !AT !"$" qchar_no_AMP ( !EQ qchar_no_AMP )*
customValue       = qchar_no_AMP*


//------------------------------------------------------------------------------
// 3. Context URL Fragments
//------------------------------------------------------------------------------

context         = "#" contextFragment
contextFragment = 'Collection($ref)'
                / '$ref'
                / 'Collection(Edm.EntityType)'
                / 'Collection(Edm.ComplexType)'
                / singletonEntity ( navigation ( containmentNavigation )* ( "/" qualifiedEntityTypeName )? )? ( selectList )?
                / qualifiedTypeName ( selectList )?
                / entitySet ( '/$deletedEntity' / '/$link' / '/$deletedLink' )
                / entitySet keyPredicate "/" contextPropertyPath ( selectList )?
                / entitySet ( selectList )? ( '/$entity' / '/$delta' )?

entitySet = entitySetName ( containmentNavigation )* ( "/" qualifiedEntityTypeName )?

containmentNavigation = keyPredicate ( "/" qualifiedEntityTypeName )? navigation
navigation            = ( "/" complexProperty ( "/" qualifiedComplexTypeName )? )* "/" navigationProperty

selectList         = OPEN selectListItem ( COMMA selectListItem )* CLOSE
selectListItem     = STAR // all structural properties
                   / allOperationsInSchema
                   / ( qualifiedEntityTypeName "/" )?
                     ( qualifiedActionName
                     / qualifiedFunctionName
                     / selectListProperty
                     )
selectListProperty = primitiveProperty
                   / primitiveColProperty
                   / navigationProperty ( '+' )? ( selectList )?
                   / selectPath ( "/" selectListProperty )?

contextPropertyPath = primitiveProperty
                    / primitiveColProperty
                    / complexColProperty
                    / complexProperty ( ( "/" qualifiedComplexTypeName )? "/" contextPropertyPath )?


//------------------------------------------------------------------------------
// 4. Expressions
//------------------------------------------------------------------------------

// Note: a boolCommonExpr is also a commonExpr, e.g. sort by Boolean
commonExpr = ( primitiveLiteral
             / parameterAlias
             / arrayOrObject
             / rootExpr
             / firstMemberExpr
             / functionExpr
             / negateExpr
             / methodCallExpr
             / parenExpr
             / castExpr
             )
             ( addExpr
             / subExpr
             / mulExpr
             / divExpr
             / modExpr
             )?

boolCommonExpr = ( isofExpr
                 / boolMethodCallExpr
                 / notExpr
                 / commonExpr
                   ( eqExpr
                   / neExpr
                   / ltExpr
                   / leExpr
                   / gtExpr
                   / geExpr
                   / hasExpr
                   )?
                 / boolParenExpr
                 ) ( andExpr / orExpr )?

rootExpr = '$root/' ( entitySetName keyPredicate / singletonEntity ) ( singleNavigationExpr )?

firstMemberExpr = memberExpr
                / inscopeVariableExpr ( "/" memberExpr )?

memberExpr = ( qualifiedEntityTypeName "/" )?
             ( propertyPathExpr
             / boundFunctionExpr
             )

propertyPathExpr = ( entityColNavigationProperty ( collectionNavigationExpr )?
                   / entityNavigationProperty    ( singleNavigationExpr )?
                   / complexColProperty          ( complexColPathExpr )?
                   / complexProperty             ( complexPathExpr )?
                   / primitiveColProperty        ( collectionPathExpr )?
                   / primitiveProperty           ( primitivePathExpr )?
                   / streamProperty              ( primitivePathExpr )?
                   )

inscopeVariableExpr  = implicitVariableExpr
                     / lambdaVariableExpr // only allowed inside a lambdaPredicateExpr
implicitVariableExpr = '$it'              // references the unnamed outer variable of the query
lambdaVariableExpr   = odataIdentifier

collectionNavigationExpr = ( "/" qualifiedEntityTypeName )?
                           ( keyPredicate ( singleNavigationExpr )?
                           / collectionPathExpr
                           )?

singleNavigationExpr = "/" memberExpr

complexColPathExpr = ( "/" qualifiedComplexTypeName )?
                     ( collectionPathExpr )?

collectionPathExpr = count
                   / "/" boundFunctionExpr
                   / "/" anyExpr
                   / "/" allExpr

complexPathExpr = ( "/" qualifiedComplexTypeName )?
                  ( "/" propertyPathExpr
                  / "/" boundFunctionExpr
                  )?

primitivePathExpr = "/" boundFunctionExpr

boundFunctionExpr = functionExpr // boundFunction segments can only be composed if the type of the
                                 // previous segment matches the type of the first function parameter

functionExpr = namespace "."
               ( entityColFunction    functionExprParameters ( collectionNavigationExpr )?
               / entityFunction       functionExprParameters ( singleNavigationExpr )?
               / complexColFunction   functionExprParameters ( complexColPathExpr )?
               / complexFunction      functionExprParameters ( complexPathExpr )?
               / primitiveColFunction functionExprParameters ( collectionPathExpr )?
               / primitiveFunction    functionExprParameters ( primitivePathExpr )?
               )

functionExprParameters = OPEN ( functionExprParameter ( COMMA functionExprParameter )* )? CLOSE
functionExprParameter  = parameterName EQ ( parameterAlias / parameterValue )

anyExpr = 'any' OPEN BWS ( lambdaVariableExpr BWS COLON BWS lambdaPredicateExpr )? BWS CLOSE
allExpr = 'all' OPEN BWS   lambdaVariableExpr BWS COLON BWS lambdaPredicateExpr   BWS CLOSE
lambdaPredicateExpr = boolCommonExpr // containing at least one lambdaVariableExpr

methodCallExpr = indexOfMethodCallExpr
               / toLowerMethodCallExpr
               / toUpperMethodCallExpr
               / trimMethodCallExpr
               / substringMethodCallExpr
               / concatMethodCallExpr
               / lengthMethodCallExpr
               / yearMethodCallExpr
               / monthMethodCallExpr
               / dayMethodCallExpr
               / hourMethodCallExpr
               / minuteMethodCallExpr
               / secondMethodCallExpr
               / fractionalsecondsMethodCallExpr
               / totalsecondsMethodCallExpr
               / dateMethodCallExpr
               / timeMethodCallExpr
               / roundMethodCallExpr
               / floorMethodCallExpr
               / ceilingMethodCallExpr
               / distanceMethodCallExpr
               / geoLengthMethodCallExpr
               / totalOffsetMinutesMethodCallExpr
               / minDateTimeMethodCallExpr
               / maxDateTimeMethodCallExpr
               / nowMethodCallExpr

boolMethodCallExpr = endsWithMethodCallExpr
                   / startsWithMethodCallExpr
                   / containsMethodCallExpr
                   / intersectsMethodCallExpr

containsMethodCallExpr   = 'contains'   OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
startsWithMethodCallExpr = 'startswith' OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
endsWithMethodCallExpr   = 'endswith'   OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
lengthMethodCallExpr     = 'length'     OPEN BWS commonExpr BWS CLOSE
indexOfMethodCallExpr    = 'indexof'    OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
substringMethodCallExpr  = 'substring'  OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS ( COMMA BWS commonExpr BWS )? CLOSE
toLowerMethodCallExpr    = 'tolower'    OPEN BWS commonExpr BWS CLOSE
toUpperMethodCallExpr    = 'toupper'    OPEN BWS commonExpr BWS CLOSE
trimMethodCallExpr       = 'trim'       OPEN BWS commonExpr BWS CLOSE
concatMethodCallExpr     = 'concat'     OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE

yearMethodCallExpr               = 'year'               OPEN BWS commonExpr BWS CLOSE
monthMethodCallExpr              = 'month'              OPEN BWS commonExpr BWS CLOSE
dayMethodCallExpr                = 'day'                OPEN BWS commonExpr BWS CLOSE
hourMethodCallExpr               = 'hour'               OPEN BWS commonExpr BWS CLOSE
minuteMethodCallExpr             = 'minute'             OPEN BWS commonExpr BWS CLOSE
secondMethodCallExpr             = 'second'             OPEN BWS commonExpr BWS CLOSE
fractionalsecondsMethodCallExpr  = 'fractionalseconds'  OPEN BWS commonExpr BWS CLOSE
totalsecondsMethodCallExpr       = 'totalseconds'       OPEN BWS commonExpr BWS CLOSE
dateMethodCallExpr               = 'date'               OPEN BWS commonExpr BWS CLOSE
timeMethodCallExpr               = 'time'               OPEN BWS commonExpr BWS CLOSE
totalOffsetMinutesMethodCallExpr = 'totaloffsetminutes' OPEN BWS commonExpr BWS CLOSE

minDateTimeMethodCallExpr = 'mindatetime' OPEN BWS CLOSE
maxDateTimeMethodCallExpr = 'maxdatetime' OPEN BWS CLOSE
nowMethodCallExpr         = 'now' OPEN BWS CLOSE

roundMethodCallExpr   = 'round'   OPEN BWS commonExpr BWS CLOSE
floorMethodCallExpr   = 'floor'   OPEN BWS commonExpr BWS CLOSE
ceilingMethodCallExpr = 'ceiling' OPEN BWS commonExpr BWS CLOSE

distanceMethodCallExpr   = 'geo.distance'   OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE
geoLengthMethodCallExpr  = 'geo.length'     OPEN BWS commonExpr BWS CLOSE
intersectsMethodCallExpr = 'geo.intersects' OPEN BWS commonExpr BWS COMMA BWS commonExpr BWS CLOSE

boolParenExpr = OPEN BWS boolCommonExpr BWS CLOSE
parenExpr     = OPEN BWS commonExpr     BWS CLOSE

andExpr = RWS 'and' RWS boolCommonExpr
orExpr  = RWS 'or'  RWS boolCommonExpr

eqExpr = RWS 'eq' RWS commonExpr
neExpr = RWS 'ne' RWS commonExpr
ltExpr = RWS 'lt' RWS commonExpr
leExpr = RWS 'le' RWS commonExpr
gtExpr = RWS 'gt' RWS commonExpr
geExpr = RWS 'ge' RWS commonExpr

hasExpr = RWS 'has' RWS enum

addExpr = RWS 'add' RWS commonExpr
subExpr = RWS 'sub' RWS commonExpr
mulExpr = RWS 'mul' RWS commonExpr
divExpr = RWS 'div' RWS commonExpr
modExpr = RWS 'mod' RWS commonExpr

negateExpr = "-" BWS commonExpr

notExpr = 'not' RWS boolCommonExpr

isofExpr = 'isof' OPEN BWS ( commonExpr BWS COMMA BWS )? qualifiedTypeName BWS CLOSE
castExpr = 'cast' OPEN BWS ( commonExpr BWS COMMA BWS )? qualifiedTypeName BWS CLOSE


//------------------------------------------------------------------------------
// 5. JSON format for function parameters
//------------------------------------------------------------------------------
// Note: the query part of a URI needs to be partially percent-decoded before
// applying these rules, see comment at the top of this file
//------------------------------------------------------------------------------

arrayOrObject = complexColInUri
              / complexInUri
              / rootExprCol
              / primitiveColInUri

complexColInUri = begin_array
                  ( complexInUri ( value_separator complexInUri )* )?
                  end_array

complexInUri = begin_object
               ( ( annotationInUri
                 / primitivePropertyInUri
                 / complexPropertyInUri
                 / collectionPropertyInUri
                 / navigationPropertyInUri
                 )
                 ( value_separator
                    ( annotationInUri
                    / primitivePropertyInUri
                    / complexPropertyInUri
                    / collectionPropertyInUri
                    / navigationPropertyInUri
                    )
                  )*
               )?
               end_object

collectionPropertyInUri = ( quotation_mark primitiveColProperty quotation_mark
                            name_separator
                            primitiveColInUri
                          )
                        / ( quotation_mark complexColProperty quotation_mark
                            name_separator
                            complexColInUri
                          )

primitiveColInUri = begin_array
                    ( primitiveLiteralInJSON ( value_separator primitiveLiteralInJSON )* )?
                    end_array

complexPropertyInUri = quotation_mark complexProperty quotation_mark
                       name_separator
                       complexInUri

annotationInUri = quotation_mark AT namespace "." termName quotation_mark
                  name_separator
                  ( complexInUri / complexColInUri / primitiveLiteralInJSON / primitiveColInUri )

primitivePropertyInUri = quotation_mark primitiveProperty quotation_mark
                         name_separator
                         primitiveLiteralInJSON

navigationPropertyInUri = singleNavPropInJSON
                        / collectionNavPropInJSON
singleNavPropInJSON     = quotation_mark entityNavigationProperty quotation_mark
													name_separator
													rootExpr
collectionNavPropInJSON = quotation_mark entityColNavigationProperty quotation_mark
													name_separator
													rootExprCol

rootExprCol = begin_array
              ( rootExpr ( value_separator rootExpr )* )?
              end_array

// JSON syntax: adapted to URI restrictions from (RFC4627)?
begin_object = BWS ( "{" / "%7B" ) BWS
end_object   = BWS ( "}" / "%7D" ) BWS

begin_array = BWS ( "(" / "%5B" ) BWS
end_array   = BWS ( ")?" / "%5D" ) BWS

quotation_mark  = DQUOTE / "%22"
name_separator  = BWS COLON BWS
value_separator = BWS COMMA BWS

primitiveLiteralInJSON = stringInJSON
                       / numberInJSON
                       / 'true'
                       / 'false'
                       / 'null'

stringInJSON = quotation_mark charInJSON* quotation_mark
charInJSON   = qchar_unescaped
             / qchar_JSON_special
             / escape ( quotation_mark
                      / escape
                      / ( "/" / "%2F" ) // solidus         U+002F - literal form is allowed in the query part of a URL
                      / 'b'             // backspace       U+0008
                      / 'f'             // form feed       U+000C
                      / 'n'             // line feed       U+000A
                      / 'r'             // carriage return U+000D
                      / 't'             // tab             U+0009
                      / 'u' HEXDIG HEXDIG HEXDIG HEXDIG     //                 U+XXXX
                      )

qchar_JSON_special = SP / ":" / "{" / "}" / "(" / ")" // some agents put these unencoded into the query part of a URL
qchar_unescaped       = unreserved / pct_encoded_unescaped / other_delims / ":" / "@" / "/" / "?" / "$" / "'" / "="

escape = "\\" / "%5C"     // reverse solidus U+005C
unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
pct_encoded_unescaped = "%" ( "0" / "1" /   "3" / "4" /   "6" / "7" / "8" / "9" / A_to_F ) HEXDIG
                      / "%" "2" ( "0" / "1" /   "3" / "4" / "5" / "6" / "7" / "8" / "9" / A_to_F )
                      / "%" "5" ( DIGIT / "A" / "B" /   "D" / "E" / "F" )

numberInJSON = "-"? int frac? exp?
int          = "0" / ( oneToNine *DIGIT )
frac         = "." DIGIT+
exp          = "e" ( "-" / "+" )? DIGIT+


//------------------------------------------------------------------------------
// 6. Names and identifiers
//------------------------------------------------------------------------------

singleQualifiedTypeName = qualifiedEntityTypeName
                        / qualifiedComplexTypeName
                        / qualifiedTypeDefinitionName
                        / qualifiedEnumTypeName
                        / primitiveTypeName

qualifiedTypeName = singleQualifiedTypeName
                  / 'Collection' OPEN singleQualifiedTypeName CLOSE

qualifiedEntityTypeName     = namespace "." entityTypeName
qualifiedComplexTypeName    = namespace "." complexTypeName
qualifiedTypeDefinitionName = namespace "." typeDefinitionName
qualifiedEnumTypeName       = namespace "." enumerationTypeName

// an alias is just a single-part namespace
namespace     = namespacePart ( "." namespacePart )*
namespacePart = odataIdentifier

entitySetName       = odataIdentifier
singletonEntity     = odataIdentifier
entityTypeName      = odataIdentifier
complexTypeName     = odataIdentifier
typeDefinitionName  = odataIdentifier
enumerationTypeName = odataIdentifier
enumerationMember   = odataIdentifier
termName            = odataIdentifier

// Note: this pattern is overly restrictive, the normative definition is type TSimpleIdentifier in OData EDM XML Schema
odataIdentifier             = $(identifierLeadingCharacter identifierCharacter*)
identifierLeadingCharacter  = ALPHA / "_"         // plus Unicode characters from the categories L or Nl
identifierCharacter         = ALPHA / "_" / DIGIT // plus Unicode characters from the categories L, Nl, Nd, Mn, Mc, Pc, or Cf

primitiveTypeName = 'Edm.' ( 'Binary'
                           / 'Boolean'
                           / 'Byte'
                           / 'Date'
                           / 'DateTimeOffset'
                           / 'Decimal'
                           / 'Double'
                           / 'Duration'
                           / 'Guid'
                           / 'Int16'
                           / 'Int32'
                           / 'Int64'
                           / 'SByte'
                           / 'Single'
                           / 'Stream'
                           / 'String'
                           / 'TimeOfDay'
                           / abstractSpatialTypeName ( concreteSpatialTypeName )?
                           )
abstractSpatialTypeName = 'Geography'
                        / 'Geometry'
concreteSpatialTypeName = 'Collection'
                        / 'LineString'
                        / 'MultiLineString'
                        / 'MultiPoint'
                        / 'MultiPolygon'
                        / 'Point'
                        / 'Polygon'

primitiveProperty       = primitiveKeyProperty / primitiveNonKeyProperty
primitiveKeyProperty    = odataIdentifier
primitiveNonKeyProperty = odataIdentifier
primitiveColProperty    = odataIdentifier
complexProperty         = odataIdentifier
complexColProperty      = odataIdentifier
streamProperty          = odataIdentifier

navigationProperty          = entityNavigationProperty / entityColNavigationProperty
entityNavigationProperty    = odataIdentifier
entityColNavigationProperty = odataIdentifier

action       = odataIdentifier
actionImport = odataIdentifier

function = entityFunction
         / entityColFunction
         / complexFunction
         / complexColFunction
         / primitiveFunction
         / primitiveColFunction

entityFunction       = odataIdentifier
entityColFunction    = odataIdentifier
complexFunction      = odataIdentifier
complexColFunction   = odataIdentifier
primitiveFunction    = odataIdentifier
primitiveColFunction = odataIdentifier

entityFunctionImport       = odataIdentifier
entityColFunctionImport    = odataIdentifier
complexFunctionImport      = odataIdentifier
complexColFunctionImport   = odataIdentifier
primitiveFunctionImport    = odataIdentifier
primitiveColFunctionImport = odataIdentifier


//------------------------------------------------------------------------------
// 7. Literal Data Values
//------------------------------------------------------------------------------

// in URLs
primitiveLiteral = nullValue                  // plain values up to int64Value
                 / booleanValue
                 / guidValue
                 / dateValue
                 / dateTimeOffsetValue
                 / timeOfDayValue
                 / decimalValue
                 / doubleValue
                 / singleValue
                 / sbyteValue
                 / byteValue
                 / int16Value
                 / int32Value
                 / int64Value
                 / string                     // single-quoted
                 / duration                   // all others are quoted and prefixed
                 / binary
                 / enum
                 / geographyCollection
                 / geographyLineString
                 / geographyMultiLineString
                 / geographyMultiPoint
                 / geographyMultiPolygon
                 / geographyPoint
                 / geographyPolygon
                 / geometryCollection
                 / geometryLineString
                 / geometryMultiLineString
                 / geometryMultiPoint
                 / geometryMultiPolygon
                 / geometryPoint
                 / geometryPolygon

// in Atom and JSON message bodies and CSDL DefaultValue attributes
primitiveValue = booleanValue
               / guidValue
               / durationValue
               / dateValue
               / dateTimeOffsetValue
               / timeOfDayValue
               / enumValue
               / fullCollectionLiteral
               / fullLineStringLiteral
               / fullMultiPointLiteral
               / fullMultiLineStringLiteral
               / fullMultiPolygonLiteral
               / fullPointLiteral
               / fullPolygonLiteral
               / decimalValue
               / doubleValue
               / singleValue
               / sbyteValue
               / byteValue
               / int16Value
               / int32Value
               / int64Value
               / binaryValue
               // also valid are:
               // - any XML string for strings in Atom and CSDL documents
               // - any JSON string for JSON documents

nullValue = 'null' {return {val:null}}

// base64url encoding according to http://tools.ietf.org/html/rfc4648#section-5
binary      = "binary" SQUOTE binaryValue SQUOTE
binaryValue = (base64char base64char base64char base64char)* ( base64b16  / base64b8 )?
base64b16   = base64char base64char ( 'A' / 'E' / 'I' / 'M' / 'Q' / 'U' / 'Y' / 'c' / 'g' / 'k' / 'o' / 's' / 'w' / '0' / '4' / '8' )   ( "=" )?
base64b8    = base64char ( 'A' / 'Q' / 'g' / 'w' ) ( "==" )?
base64char  = ALPHA / DIGIT / "-" / "_"

booleanValue = val:( true / false ) {return {val}}
true = "true" {return true}
false = "false" {return false}

decimalValue = s:$((SIGN)? DIGIT+ ("." DIGIT+)?)
{return {val:Number(s)}}

doubleValue = s:$(decimalValue ( "e" (SIGN)? DIGIT+ )? / nanInfinity) // IEEE 754 binary64 floating-point number (15-17 decimal digits)
{return {val:Number(s)}}

singleValue = doubleValue                                       // IEEE 754 binary32 floating-point number (6-9 decimal digits)
nanInfinity = 'NaN' / '-INF' / 'INF'

guidValue = $(
  /*  8 */ HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG
  /*  4 */ "-" HEXDIG HEXDIG HEXDIG HEXDIG
  /*  4 */ "-" HEXDIG HEXDIG HEXDIG HEXDIG
  /*  4 */ "-" HEXDIG HEXDIG HEXDIG HEXDIG
  /* 12 */ "-" HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG HEXDIG
)

byteValue  = ( DIGIT DIGIT DIGIT )+            // numbers in the range from 0 to 255
sbyteValue = sign? byteValue  // numbers in the range from -128 to 127
int16Value = sign? ( DIGIT DIGIT DIGIT DIGIT DIGIT )+  // numbers in the range from -32768 to 32767
int32Value = sign? ( DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT )+ // numbers in the range from -2147483648 to 2147483647
int64Value = sign? ( DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT )+ // numbers in the range from -9223372036854775808 to 9223372036854775807
sign       = "+" / "-"

string           = SQUOTE ( SQUOTE_in_string / !SQUOTE pchar )* SQUOTE
SQUOTE_in_string = SQUOTE SQUOTE // two consecutive single quotes represent one within a string literal

qchar_no_AMP  = unreserved / pct_encoded / other_delims / ":" / "@" / "/" / "?" / "$" / "'" / "="
pchar         = unreserved / pct_encoded / sub_delims / ":" / "@"
pct_encoded   = "%" HEXDIG HEXDIG
sub_delims    = "$" / "&" / "'" / "=" / other_delims
other_delims  = "!" / "(" / ")" / "*" / "+" / "," / ";"

dateValue = year "-" month "-" day

dateTimeOffsetValue = year "-" month "-" day "T" hour ":" minute ( ":" second ( "." fractionalSeconds )? )? ( "Z" / sign hour ":" minute )

duration      = "duration" SQUOTE durationValue SQUOTE
durationValue = sign? "P" ( DIGIT+ "D" )? ( "T" ( DIGIT+ "H" )? ( DIGIT+ "M" )? ( DIGIT+ ( "." DIGIT+ )? "S" )? )?
     // the above is an approximation of the rules for an xml dayTimeDuration.
     // see the lexical representation for dayTimeDuration in http://www.w3.org/TR/xmlschema11-2#dayTimeDuration for more information

timeOfDayValue = hour ":" minute ( ":" second ( "." fractionalSeconds )? )?

oneToNine       = "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9"
zeroToFiftyNine = ( "0" / "1" / "2" / "3" / "4" / "5" ) DIGIT
year  = ( "-" )? ( "0" ( DIGIT DIGIT DIGIT ) / oneToNine DIGIT DIGIT DIGIT )
month = "0" oneToNine
      / "1" ( "0" / "1" / "2" )
day   = "0" oneToNine
      / ( "1" / "2" ) DIGIT
      / "3" ( "0" / "1" )
hour   = ( "0" / "1" ) DIGIT
       / "2" ( "0" / "1" / "2" / "3" )
minute = zeroToFiftyNine
second = zeroToFiftyNine
fractionalSeconds = DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT DIGIT

enum            = qualifiedEnumTypeName SQUOTE enumValue SQUOTE
enumValue       = singleEnumValue ( COMMA singleEnumValue )*
singleEnumValue = enumerationMember / enumMemberValue
enumMemberValue = int64Value

geographyCollection   = geographyPrefix SQUOTE fullCollectionLiteral SQUOTE
fullCollectionLiteral = sridLiteral collectionLiteral
collectionLiteral     = "Collection(" geoLiteral ( COMMA geoLiteral )* CLOSE
geoLiteral            = collectionLiteral
                      / lineStringLiteral
                      / multiPointLiteral
                      / multiLineStringLiteral
                      / multiPolygonLiteral
                      / pointLiteral
                      / polygonLiteral

geographyLineString   = geographyPrefix SQUOTE fullLineStringLiteral SQUOTE
fullLineStringLiteral = sridLiteral lineStringLiteral
lineStringLiteral     = "LineString" lineStringData
lineStringData        = OPEN positionLiteral ( COMMA positionLiteral )+ CLOSE

geographyMultiLineString   = geographyPrefix SQUOTE fullMultiLineStringLiteral SQUOTE
fullMultiLineStringLiteral = sridLiteral multiLineStringLiteral
multiLineStringLiteral     = "MultiLineString(" ( lineStringData ( COMMA lineStringData )* )? CLOSE

geographyMultiPoint   = geographyPrefix SQUOTE fullMultiPointLiteral SQUOTE
fullMultiPointLiteral = sridLiteral multiPointLiteral
multiPointLiteral     = "MultiPoint(" ( pointData ( COMMA pointData )* )? CLOSE

geographyMultiPolygon   = geographyPrefix SQUOTE fullMultiPolygonLiteral SQUOTE
fullMultiPolygonLiteral = sridLiteral multiPolygonLiteral
multiPolygonLiteral     = "MultiPolygon(" ( polygonData ( COMMA polygonData )* )? CLOSE

geographyPoint   = geographyPrefix SQUOTE fullPointLiteral SQUOTE
fullPointLiteral = sridLiteral pointLiteral
sridLiteral      = "SRID" EQ DIGIT DIGIT DIGIT DIGIT DIGIT SEMI
pointLiteral     ="Point" pointData
pointData        = OPEN positionLiteral CLOSE
positionLiteral  = doubleValue SP doubleValue  // longitude, then latitude

geographyPolygon   = geographyPrefix SQUOTE fullPolygonLiteral SQUOTE
fullPolygonLiteral = sridLiteral polygonLiteral
polygonLiteral     = "Polygon" polygonData
polygonData        = OPEN ringLiteral ( COMMA ringLiteral )* CLOSE
ringLiteral        = OPEN positionLiteral ( COMMA positionLiteral )* CLOSE
                   // Within each ringLiteral, the first and last positionLiteral elements MUST be an exact syntactic match to each other.
                   // Within the polygonData, the ringLiterals MUST specify their points in appropriate winding order.
                   // In order of traversal, points to the left side of the ring are interpreted as being in the polygon.

geometryCollection      = geometryPrefix SQUOTE fullCollectionLiteral      SQUOTE
geometryLineString      = geometryPrefix SQUOTE fullLineStringLiteral      SQUOTE
geometryMultiLineString = geometryPrefix SQUOTE fullMultiLineStringLiteral SQUOTE
geometryMultiPoint      = geometryPrefix SQUOTE fullMultiPointLiteral      SQUOTE
geometryMultiPolygon    = geometryPrefix SQUOTE fullMultiPolygonLiteral    SQUOTE
geometryPoint           = geometryPrefix SQUOTE fullPointLiteral           SQUOTE
geometryPolygon         = geometryPrefix SQUOTE fullPolygonLiteral         SQUOTE

geographyPrefix = "geography"
geometryPrefix  = "geometry"


//------------------------------------------------------------------------------
// 8. Header values
//------------------------------------------------------------------------------

header = content_id
       / odata_entityid
       / odata_isolation
       / odata_maxversion
       / odata_version
       / prefer

content_id = "Content-ID" ":" OWS unreserved+

odata_entityid   = "OData-EntityID"   ":" OWS ![^&]+ //was: IRI-in-header
odata_isolation  = "OData-Isolation"  ":" OWS "snapshot"
odata_maxversion = "OData-MaxVersion" ":" OWS DIGIT+ "." DIGIT+
odata_version    = "OData-Version"    ":" OWS "4.0"

prefer     = "Prefer" ":" OWS preference ( COMMA preference )*
preference = allowEntityReferencesPreference
           / callbackPreference
           / continueOnErrorPreference
           / includeAnnotationsPreference
           / maxpagesizePreference
           / respondAsyncPreference
           / returnPreference
           / trackChangesPreference
           / waitPreference
           // and everything allowed by http://tools.ietf.org/html/draft-snell-http-prefer-18
           // / token ( EQ_h word )? ( OWS ";" ( OWS parameter )? )*

allowEntityReferencesPreference = "odata.allow-entityreferences"

callbackPreference = "odata.callback" OWS ";" OWS "url" EQ_h DQUOTE [^"]* DQUOTE

continueOnErrorPreference = "odata.continue-on-error"

includeAnnotationsPreference = "odata.include-annotations" EQ_h DQUOTE annotationsList DQUOTE
annotationsList      = annotationIdentifier (COMMA annotationIdentifier)*
annotationIdentifier = ( excludeOperator )?
                       ( STAR
                       / namespace "." ( termName / STAR )
                       )
                       ( "#" odataIdentifier )?
excludeOperator      = "-"

maxpagesizePreference = "odata.maxpagesize" EQ_h oneToNine *DIGIT

respondAsyncPreference = "respond-async"

returnPreference = "return" EQ_h ( 'representation' / 'minimal' )

trackChangesPreference = "odata.track-changes"

waitPreference = "wait" EQ_h DIGIT+

//parameter      = token ( EQ_h word )?
//word           = token / quoted-string
//token          = 1*tchar
//tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
//               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
//               / DIGIT / ALPHA
//quoted-string  = DQUOTE ( qdtext / quoted-pair )* DQUOTE
//qdtext         = %x21 / %x23-5B / %x5D-7E / obs_text / OWS
//obs_text       = %x80-FF
//quoted-pair    = "\" ( HTAB / SP / VCHAR / obs_text )

OWS   = ( SP / HTAB )*  // "optional" whitespace
BWS_h = ( SP / HTAB )*  // "bad" whitespace in header values
EQ_h  = BWS_h EQ BWS_h


//------------------------------------------------------------------------------
// 9. Punctuation
//------------------------------------------------------------------------------

RWS = ( SP / HTAB / "%20" / "%09" )+  // "required" whitespace
BWS = ( SP / HTAB / "%20" / "%09" )*  // "bad" whitespace

AT     = "@" / "%40"
COLON  = ":" / "%3A"
COMMA  = "," / "%2C"
EQ     = "="
SIGN   = "+" / "%2B" / "-"
SEMI   = ";" / "%3B"
STAR   = "*" / "%2A"
SQUOTE = "'" / "%27"

OPEN  = "(" / "%28"
CLOSE = ")" / "%29"



//------------------------------------------------------------------------------
// C. ABNF core definitions [RFC5234]
//------------------------------------------------------------------------------

ALPHA  = [A-Za-z]
DIGIT  = [0-9]
HEXDIG = DIGIT / A_to_F
A_to_F = "A" / "B" / "C" / "D" / "E" / "F"
DQUOTE = '"'
SP     = " "
HTAB   = "\t"
//WSP    = SP / HTAB
//LWSP = (WSP / CRLF WSP)*
VCHAR = [!-~]
//CHAR = %x01-7F
//LOCTET = %x00-FF
//CR     = %x0D
//LF     = %x0A
//CRLF   = CR LF
//BIT = "0" / "1"


//------------------------------------------------------------------------------
// End of odata-abnf-construction-rules
//------------------------------------------------------------------------------
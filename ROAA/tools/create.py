from lxml import etree
try:
    from StringIO import StringIO, BytesIO
except ImportError:
    from io import StringIO, BytesIO


def addCaller(caller):
    global CALLERLIST
    global RESULTLIST
    global CALLERLIST_P
    global CALLERLIST_CPP
    CALLERLIST += "\t\"" + caller + "\"" + " : " + str(CALLERCOUNTER) + ",\n"
    if RESULTLIST is not "":
        RESULTLIST = RESULTLIST[:-2] + " };\ncodeMap[caller[\"" + caller + "\"]] = {};\n"
    else:
        RESULTLIST += "codeMap[caller[\"" + caller + "\"]] = {};\n"
        CALLERLIST_P = "callers = {\n"
        CALLERLIST_CPP = "namespace GUI\n{\n\tnamespace Caller\n\t{\n"
        CALLERLIST_CPP += "\t\tenum\n\t\t{\n"
    CALLERLIST_P += "\t'" + caller + "'" + ": " + str(CALLERCOUNTER) + ",\n"
    CALLERLIST_CPP += "\t\t\t" + caller + " = " + str(CALLERCOUNTER) + ",\n"


def addAction(caller, action):
    global ACTIONLIST
    global ACTIONLIST_P
    global ACTIONLIST_CPP
    if isFirstAction:
        ACTIONLIST += "actionMap[caller[" + "\"" + caller + "\"" + "]] = { " + "\"" + action + "\"" + " : " + str(
            ACTIONCOUNTER) + ", "
    else:
        ACTIONLIST += "\"" + action + "\"" + " : " + str(ACTIONCOUNTER) + ", "
    if ACTIONLIST_P is "":
        ACTIONLIST_P = "actions = {\n"
        ACTIONLIST_CPP = "namespace GUI\n{\n\tnamespace Action\n\t{\n"
        ACTIONLIST_CPP += "\t\tenum\n\t\t{\n"
    ACTIONLIST_P += "\t'" + caller + "_" + action + "'" + ": " + str(ACTIONCOUNTER) + ",\n"
    ACTIONLIST_CPP += "\t\t\t" + caller + "_" + action + " = " + str(ACTIONCOUNTER) + ",\n"


def addResultcode(caller, action, code):
    global RESULTLIST
    global RESULTLIST_P
    global RESULTLIST_CPP
    if isFirstResult:
        RESULTLIST += "codeMap[caller[" + "\"" + caller + "\"" + "]][" + "actionMap" + "[" + "caller" + "[" + "\"" + caller + "\"" + "]]" + "[" + "\"" + action + "\"" + "]] = {"
    RESULTLIST += "\"" + code + "\"" + " : " + str(RESULTCOUNTER) + ", "
    if RESULTLIST_P is "":
        RESULTLIST_P = "result_codes = {\n"
        RESULTLIST_CPP = "namespace GUI\n{\n\tnamespace Results\n\t{\n"
        RESULTLIST_CPP += "\t\tenum\n\t\t{\n"
    RESULTLIST_P += "\t'" + caller + "_" + action + "_" + code + "'" + ": " + str(RESULTCOUNTER) + ",\n"
    RESULTLIST_CPP += "\t\t\t" + caller + "_" + action + "_" + code + " = " + str(RESULTCOUNTER) + ",\n"


def addErrorcode(error):
    global ERRORS
    global ERRORS_P
    global ERRORSCOUNTER
    global ERRORSCOUNTER

    if ERRORS_P is "":
        ERRORS_P += "global_errors = {\n"
    ERRORS_P += "\t'" + error + "': " + str(ERRORSCOUNTER) + ",\n"
    ERRORS += "\"" + error + "\": " + str(ERRORSCOUNTER) + ", "


# Constants
CALLERLIST = ""
ACTIONLIST = ""
RESULTLIST = ""
CALLERLIST_P = ""
ACTIONLIST_P = ""
RESULTLIST_P = ""
CALLERLIST_CPP = ""
ACTIONLIST_CPP = ""
RESULTLIST_CPP = ""
ERRORS = ""
ERRORS_P = ""
ERRORS_CPP = ""
CALLERCOUNTER = 1
ACTIONCOUNTER = 0
RESULTCOUNTER = 0
ERRORSCOUNTER = 0

# temp values
currentCaller = ""
currentAction = ""
isFirstResult = True
isFirstAction = True

# Create xml tree
tree = etree.parse('defines.xml')

# Loop
for elem in tree.iter("*"):
    if elem.tag == "caller":
        currentCaller = str(elem.attrib["name"]).upper()
        addCaller(currentCaller)
        CALLERCOUNTER += 1
        isFirstResult = True
        isFirstAction = True
        if ACTIONLIST is not "":
            ACTIONLIST = ACTIONLIST[:-2] + " };\n"
        RESULTCOUNTER = 0
        ACTIONCOUNTER = 0
    if elem.tag == "action":
        currentAction = str(elem.attrib["name"]).upper()
        addAction(currentCaller, currentAction)
        ACTIONCOUNTER += 1
        RESULTCOUNTER = 0
        isFirstAction = False
        if not isFirstResult:
            RESULTLIST = RESULTLIST[:-2] + " };\n"
        isFirstResult = True
    if elem.tag == "result_code":
        addResultcode(currentCaller, currentAction, str(elem.attrib["name"]).upper())
        RESULTCOUNTER += 1
        isFirstResult = False
    if elem.tag == "error":
        addErrorcode(str(elem.attrib["name"].upper()))
        ERRORSCOUNTER += 1

# save
javascript = "var caller =\n"
javascript += "{\n"
javascript += "\t\"GLOBAL\": 0,\n"
javascript += CALLERLIST[:-2]
javascript += "\n};"

javascript += "\n\n"
javascript += "var actionMap ={};\n"
javascript += "actionMap[caller[\"GLOBAL\"]] = { \"GLOBAL\" : 0 };\n"
ACTIONLIST = ACTIONLIST[:-2] + " };\n"
javascript += ACTIONLIST

javascript += "\n\n"
javascript += "var codeMap = {};\n"
javascript += "codeMap[caller[\"GLOBAL\"]] = {};\n"
javascript += "codeMap[caller[\"GLOBAL\"]][actionMap[caller[\"GLOBAL\"]][\"GLOBAL\"]]  =  {" + ERRORS[:-2] + "};\n"
javascript += RESULTLIST[:-2] + " };"

python = CALLERLIST_P[:-1] + "\n}"

python += "\n\n"
python += ACTIONLIST_P[:-1] + "\n}"

python += "\n\n"
python += RESULTLIST_P[:-1] + "\n}\n\n"
python += ERRORS_P + "}\n"
python = python.replace('\t', '    ')

cpp = '#ifndef __GUI_CONSTS_H__\n'
cpp += '#define __GUI_CONSTS_H__\n\n'
cpp += CALLERLIST_CPP[:-2] + "\n\t\t};\n\t}\n}"

cpp += "\n\n"
cpp += ACTIONLIST_CPP[:-2] + "\n\t\t};\n\t}\n}"

cpp += "\n\n"
cpp += RESULTLIST_CPP[:-2] + "\n\t\t};\n\t}\n}"
cpp += '\n#endif /* __GUI_CONSTANTS_H__ */'

f = open('exports.js', 'w')
f.write(javascript)

f = open('../project/constants.py', 'w')
f.write(python)

f = open('../project/constants.cpp','w');
f.write(cpp);
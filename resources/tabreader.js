var adebug = 0; //SET THIS TO 1 TO ENABLE DEBUG, 2 FOR LINE DEBUGGING
var runonce = 0;
var hasanim = 0;
var hasotherver = 0;
var veriteration = 0;
var dbpos = [];
var athis, tabref;
var otherverindex = 0;

$(document).ready(function() {
    if (!runonce) {
        console.log('Init');
    	var i = 0;
        $('#readerenabler').attr('onclick', '');
        $('#readerenabler').attr('style', '');
        $('#readerenabler').html('Reader enabled');
    	$('a[href$=".txt"]').each(function(){
            $(this).attr('tabref', $(this).attr('href'));
            $(this).attr('href', '#');

            $(this).on('click', function() {
                tabref = $(this).attr('tabref');
                athis = $(this);
                gettab(tabref,0,athis);
            });

    		i++;
    	});

        runonce = 1;
    }
});

function gettab(filename, pos, athis) {
	$(athis).html(' Preparing tab... ');
	$(athis).css('color', '#006400');
	$(athis).attr('onclick', '');
    getDebug("reading file: " + filename, 1);
	$.ajax({
        url : "./" + filename,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded; charset=ASCII",
        success : function (txt) {
            getDebug("got file: " + filename, 1);
            var lines = txt.replace(/ /g, '\xA0').split("\n");
            var introfound = 0;
            var introlastindex;
            var legendstartindex;
            var legendendindex = 0;
            var error = 0;
            var tabdur = 0;
            var firstlineslash = 0;
            var seventhlineslash = 0;
            var topline = new Array();
            var eindexes = new Array();
            var aindexes = new Array();
            var dindexes = new Array();
            var gindexes = new Array();
            var bindexes = new Array();
            var etindexes = new Array();    

            for (var i = pos, len = lines.length; i < len; i++) {
                //Get introduction text
    			var slashes = lines[i].match(/-/ig) || [];
                var doubleslash = lines[i].match(/=/ig) || [];
                var slashcount = slashes.length + doubleslash.length;
                if (slashcount >= 10) {
                	if (lines[i].charAt(0) == 'e' || lines[i].charAt(0) == 'E' || lines[i].charAt(0) == 'd' || lines[i].charAt(0) == 'D' || lines[i].charAt(0) == '|' || lines[i].charAt(0) == '\xA0') {
                		introlastindex = i - 2; //Remove two lines to get intro last index
                        if (slashcount >= ((lines[i+6].match(/-/ig) || []) + (lines[i+6].match(/=/ig) || []))) {
                            getDebug('Got intro index at line ' + introlastindex, 1);
                            etindexes[0] = i; //First e line
                            getDebug('Got first e line ' + lines[i] + ' at line ' + etindexes[0], 1);
                            topline[0] = i-1; //First topline
                            getDebug('Got first top line at line ' + topline[0], 1);
                            introfound = 1;
                        } else { //Was most likely a n-tolet line
                            getDebug('Got intro index at line ' + introlastindex, 1);
                            etindexes[0] = i+1; //First e line
                            getDebug('Got first e line at line ' + etindexes[0], 1);
                            topline[0] = i; //First topline
                            getDebug('Got first top line at line ' + topline[0], 1);
                            introfound = 1;
                        }
                		break;
                	}
                }
            }   

            if (introfound === 0) {
                error = 1;
                getDebug('Error at line ' + i + ', cannot find first tab line. Line returned: ' + lines[i], adebug);
            } else if (error === 0) { //Get tab lines if introduction properly found
            	var lastindex = etindexes[0];
            	var j = 1;

            	while(lastindex < lines.length) {
                    getDebug("Starting iteration " + j, 1);
    	        	if (error === 0) {
    		        	for (var i = 1; i <= 5; i++) { //Trying to find 6 other lines
                            if (lines[lastindex+i] !== undefined) {
        		        		var slashes = lines[lastindex+i].match(/-/ig) || [];
                                var doubleslash = lines[lastindex+i].match(/=/ig) || [];
                                var slashcount = slashes.length + doubleslash.length;
        		        		if (slashcount >= 10) {
                                    if (i == 1 && (slashcount <= ((lines[i+6].match(/-/ig) || []) + (lines[i+6].match(/=/ig) || [])))) {
            		        			switch (i) {
            		        				case 1:
            		        					bindexes.push(lastindex+i+1);
            		        					break;
            		        				case 2:
            		        					gindexes.push(lastindex+i+1);
            		        					break;
            		        				case 3:
            		        					dindexes.push(lastindex+i+1);
            		        					break;
            		        				case 4:
            		        					aindexes.push(lastindex+i+1);
            		        					break;
            		        				case 5:
            		        					eindexes.push(lastindex+i+1);
                                                getDebug('Got E line: ' + lines[lastindex+i] + ' at line: ' + (lastindex+i), 1);
            		        					break;
            		        				default:
            		        					break; //Nothing to do
            		        			}
                                    } else { //Most likely a n-tolet line
                                        switch (i) {
                                            case 1:
                                                bindexes.push(lastindex+i);
                                                break;
                                            case 2:
                                                gindexes.push(lastindex+i);
                                                break;
                                            case 3:
                                                dindexes.push(lastindex+i);
                                                break;
                                            case 4:
                                                aindexes.push(lastindex+i);
                                                break;
                                            case 5:
                                                eindexes.push(lastindex+i);
                                                getDebug('Got E line: ' + lines[lastindex+i] + ' at line: ' + (lastindex+i), 1);
                                                break;
                                            default:
                                                break; //Nothing to do
                                        }
                                    }
        		        		} else if (i == 5) {
        		        			error = 1 //The following 5 lines should be tab lines. If not sure throw error
        		        			getDebug('Error at line ' + (lastindex+i) + ', last checked line is not a tab. Given line: ' + lines[lastindex+i], 1);
        		        			break;
        		        		}
                            } else {
                                getDebug('Got undefined line at lastindex: ' + lastindex, 1);
                                break;
                            }
    		        	}	   

    		        	lastindex = lastindex+6; //We are now 6 lines after the e line	  

    		        	for (var i = 0; i <= 8; i++) { //Check for another e line in the next 7 lines
                            getDebug('Searching next tab measure at line: ' + (lastindex+i), 2);
                            if (lines[lastindex+i] !== undefined) {
        		        		var slashes = lines[lastindex+i].match(/-/ig) || [];
        	            		var doubleslash = lines[lastindex+i].match(/=/ig) || [];
                                var slashcount = slashes.length + doubleslash.length;
                                if (slashcount >= 10) {
        	            			if (lines[lastindex+i].charAt(0) == 'e' || lines[lastindex+i].charAt(0) == 'E' || lines[lastindex+i].charAt(0) == 'd' || lines[lastindex+i].charAt(0) == 'D' || lines[lastindex+i].charAt(0) == '|' || lines[lastindex+i].charAt(0) == '-' || lines[lastindex+i].charAt(1) == '-') {
        			            		getDebug('Found new e line: ' + lines[lastindex+i], 1);
                                        //Check for fake tab line
                                        var slashes = lines[lastindex+i+1].match(/-/ig) || [];
                                        if (slashes.length < 5 && lines[lastindex+i].charAt(0) != 'E') {
                                            getDebug("Was a fake tab line, consider tab done", 1);
                                            legendstartindex = lastindex+i;
                                            if ((lastindex+i+40)<lines.length) {
                                                getDebug('Has other version...');
                                                hasotherver = 1;
                                                otherverindex = lastindex+i;
                                            } else {
                                                hasotherver = 0;
                                            }
                                            lastindex = lines.length + 1;
                                            break;
                                        }
                                        etindexes.push(lastindex+i);                                    
                                        topline.push(lastindex+i-1);
                                        lastindex = lastindex+i;
        			            		break;
        			            	}
                                } else if (i == 8 && lastindex+i >= (lines.length-50)) {
                                    getDebug('Tablature section ended at line ' + (lastindex+i), 1);
                                    legendstartindex = lastindex+i; //Suppose we are done at this point
                                    lastindex = lines.length + 1; //Kill the while loop
                                    break;
        	            		} else if (i == 8) {
                                    //error = 1; //No error for now... let's see what that gives
                                    legendstartindex = lastindex+i; // temporary
                                    lastindex = lines.length + 1; //Kill the while loop, error.
                                    getDebug('Error at end of file. Cannot find last tab line. Last line: ' + (lastindex+i), 1);
                                    break;
                                } else if (lines[lastindex+i].indexOf('*******') > -1) {
                                    getDebug('Tablature section killed at line ' + (lastindex+i) + ' with special line *****. Lines length: ' + lines.length, 1);
                                    legendstartindex = lastindex; //Usually no legend after star bar
                                    legendendindex = lastindex+i;
                                    if ((lastindex+i+40)<lines.length && hasotherver == 0) {
                                        getDebug('Has other version...');
                                        hasotherver = 1;
                                        otherverindex = lastindex+i;
                                    } else {
                                        hasotherver = 0;
                                    }
                                    lastindex = lines.length + 1; //Kill the while loop
                                    break;
                                } else {
                                    getDebug('No tab line at line: ' + (lastindex+i) + ' slashcount at: ' + slashcount + ' for line: ' + lines[(lastindex+i)], 2);
                                }
                            } else {
                                //line overflow. Consider no legend
                                legendstartindex = lastindex-1;
                                lastindex = lines.length + 1; //Kill the while loop
                                getDebug('Line overflow, kill tab', 1);
                            }
    		        	}
    		        } else {
                        getDebug('Error, aborting line search at lastindex: ' + lastindex, 1);
    		        	lastindex = lines.length + 1; //Kill the while loop, error.
    		        }

                    j++;
    	        }
            }   

            if (error === 0) {
                if (adebug == 2) {
                	getDebug('Success', 1);
                	getDebug('Introduction ends at line ' + introlastindex, 1);
                	getDebug('Legend starts at line ' + legendstartindex, 1);
                	getDebug('top lines: ', 2);
                 	for(var i = 0; i<=topline.length; i++) {
                		getDebug(topline[i] + ", ", 2);
                	}       	
                	getDebug('e lines: ', 2);
                	for(var i = 0; i<=etindexes.length; i++) {
                		getDebug(etindexes[i] + ", ", 2);
                	}
                	getDebug('b lines: ', 2);
                	for(var i = 0; i<=bindexes.length; i++) {
                		getDebug(bindexes[i] + ", ", 2);
                	}
                	getDebug('g lines: ', 2);
                	for(var i = 0; i<=gindexes.length; i++) {
                		getDebug(gindexes[i] + ", ", 2);
                	}
                	getDebug('d lines: ', 2);
                	for(var i = 0; i<=dindexes.length; i++) {
                		getDebug(dindexes[i] + ", ", 2);
                	}
                	getDebug('a lines: ', 2);
                	for(var i = 0; i<=aindexes.length; i++) {
                		getDebug(aindexes[i] + ", ", 2);
                	}
                	getDebug('E lines: ', 2);
                	for(var i = 0; i<=eindexes.length; i++) {
                		getDebug(eindexes[i] + ", ", 2);
                	}
                }

                //Concatenate lines and format
                var trimsize = 0; //How much to trim topline
                var padsize = 0; //How much to decrease padding
                var mescount = 0; //# portées
                var lastmeasure = 0; //# of measures, +2 for now.
                var tempo;
                var timeratio;
                var temptopline = "";
                var introstring = "";
                var legendstring = "";
                var topstring = "";
                var etstring = "";
                var bstring = "";
                var gstring = "";
                var dstring = "";
                var astring = "";
                var estring = "";

                for (var i = 0; i <= etindexes.length; i++) {
                    padsize = 0;
                    notrim = 0; //Can't be trimmed, so likely empty. Adjust padding in consequence
                    if (etindexes[i] !== undefined) {
                        getDebug('FOR LINE: ' + lines[etindexes[i]] + ' AT INDEX ' + etindexes[i], 2); 
                        if (i > 0) {
                            if (lines[etindexes[i]].substr(0,3) == "e-\|" || lines[etindexes[i]].substr(0,3) == "E-\|" || lines[etindexes[i]].substr(0,3) == "d-\|" || lines[etindexes[i]].substr(0,3) == "D-\|") {
                                lines[etindexes[i]] = lines[etindexes[i]].substring(3);
                                trimsize = 3;
                            } else if (lines[etindexes[i]].substr(0,2) == "e\|" || lines[etindexes[i]].substr(0,2) == "E\|" || lines[etindexes[i]].substr(0,2) == "d\|" || lines[etindexes[i]].substr(0,2) == "D\|") {
                                lines[etindexes[i]] = lines[etindexes[i]].substring(2);
                                trimsize = 2;
                            } else if (lines[etindexes[i]].charAt(0) == "e" || lines[etindexes[i]].charAt(0) == "E" || lines[etindexes[i]].charAt(0) == "d" || lines[etindexes[i]].charAt(0) == "D") {
                                lines[etindexes[i]] = lines[etindexes[i]].substring(1);
                                trimsize = 1;
                            }
                        }
                        getDebug("substr 0 3: " + lines[etindexes[i]].substr(0,3) + " trimsize: " + trimsize, 2);

                        if (lines[etindexes[i]].substr(-3) == "||\r" ) {
                            lines[etindexes[i]] = lines[etindexes[i]].slice(0, -1);
                            lines[etindexes[i]] = lines[etindexes[i]] + "\r";
                            padsize++;
                            getDebug("Got line ending with |, trimming to " + lines[etindexes[i]], 2);
                        }
                        
                        etstring += lines[etindexes[i]].replace(/\s/g, "");
                    }
                    if (topline[i] !== undefined) {
                        if (lines[topline[i]].substr(0,4).match(/\d+/) !== null) {
                            lastmeasure = parseInt(lines[topline[i]].substr(0,4).match(/\d+/)[0]);
                        }

                        var strlength = lines[etindexes[i]].replace('\r', '').length; 
                        var topstrlength = lines[topline[i]].replace('\r', '').length;
                        getDebug('String length is: ' + strlength + '. Topline length is: ' + topstrlength + '. Trimming at: ' + trimsize + '. Padsize at: ' + padsize, 2);
                        //Will need to cut spaces - trimming first letters
                        temptopline = lines[topline[i]].replace('\r', '');

                        if (trimsize != 0) {
                            getDebug("Started trimming " + trimsize + " characters from topline " + lines[topline[i]], 2);
                            var trimtotal = 0;

                            for (var j = 0; j<=10; j++) {
                                if (trimtotal == trimsize) {
                                    break;
                                }

                                if (temptopline.charAt(j) == "\xA0") {
                                    getDebug("Trimmed a '" + temptopline.charAt(j) + "' at position " + j + " in topline " + lines[topline[i]], 2);
                                    temptopline = temptopline.substr(0,j) + temptopline.substr(j+1,temptopline.length-j+1);
                                    getDebug("Trimmed result: " + temptopline, 2);
                                    trimtotal++;
                                }

                                if (j == 10) {
                                    getDebug("Couldn't trim enough lines at topline " + lines[topline[i]], 1);
                                    notrim = 1;
                                }
                            }
                        }
                        
                        if ((strlength-topstrlength.length) < 0) {
                            getDebug('Error - topline size is bigger than e line. This is not implemented yet', 1);
                            error = 1;
                            $(athis).html(' Tab not yet compatible! ');
                            $(athis).css('color', 'red');
                            break;
                        }

                        if (notrim) {
                            getDebug('Topline padding decreased by ' + trimsize + ' char(s).', 2);
                            if ((strlength-trimsize-padsize) > 0) {
                                topstring += temptopline.padRight((strlength-trimsize-padsize), "\xA0"); 
                            }
                        } else if (topstrlength != strlength) {
                            if (strlength-topstrlength >= 0) {
                                getDebug('Padding with ' + (strlength-topstrlength) + ' spaces.', 2);
                                topstring += temptopline.padRight(strlength-padsize, "\xA0"); 
                            }
                        } else {
                            getDebug('No padding required', 2);
                            topstring += temptopline;
                        }
                    }

                    mescount++;
                }

                for (var i = 0; i <= bindexes.length; i++) {
                    if (bindexes[i] !== undefined) {
                        if (i > 0) {
                            //Expect every line to start the same way
                            getDebug("trimming b string. trimsize: " + trimsize + " i: " + i,2);
                            lines[bindexes[i]] = lines[bindexes[i]].substring(trimsize);
                        }

                        if (lines[bindexes[i]].substr(-2) == "|\r" && lines[bindexes[i]].substr(-3) != "||\r" ) {
                            lines[bindexes[i]] = lines[bindexes[i]].slice(0, -1);
                            lines[bindexes[i]] = lines[bindexes[i]] + "\r";
                        }

                        bstring += lines[bindexes[i]].replace(/\s/g, "");
                    }
                }

                for (var i = 0; i <= gindexes.length; i++) {
                    if (gindexes[i] !== undefined) {
                        if (i > 0) {
                            lines[gindexes[i]] = lines[gindexes[i]].substring(trimsize);
                        }

                        if (lines[gindexes[i]].substr(-2) == "|\r" && lines[gindexes[i]].substr(-3) != "||\r" ) {
                            lines[gindexes[i]] = lines[gindexes[i]].slice(0, -1);
                            lines[gindexes[i]] = lines[gindexes[i]] + "\r";
                        }

                        gstring += lines[gindexes[i]].replace(/\s/g, "");
                    }
                }

                for (var i = 0; i <= dindexes.length; i++) {
                    if (dindexes[i] !== undefined) {
                        if (i > 0) {
                            lines[dindexes[i]] = lines[dindexes[i]].substring(trimsize);
                        }

                        if (lines[dindexes[i]].substr(-2) == "|\r" && lines[dindexes[i]].substr(-3) != "||\r" ) {
                            lines[dindexes[i]] = lines[dindexes[i]].slice(0, -1);
                            lines[dindexes[i]] = lines[dindexes[i]] + "\r";
                        }

                        dstring += lines[dindexes[i]].replace(/\s/g, "");
                    }
                }

                for (var i = 0; i <= aindexes.length; i++) {
                    if (aindexes[i] !== undefined) {
                        if (i > 0) {
                            lines[aindexes[i]] = lines[aindexes[i]].substring(trimsize);
                        }

                        if (lines[aindexes[i]].substr(-2) == "|\r" && lines[aindexes[i]].substr(-3) != "||\r" ) {
                            lines[aindexes[i]] = lines[aindexes[i]].slice(0, -1);
                            lines[aindexes[i]] = lines[aindexes[i]] + "\r";
                        }

                        astring += lines[aindexes[i]].replace(/\s/g, "");
                    }
                }

                for (var i = 0; i <= eindexes.length; i++) {
                    if (eindexes[i] !== undefined) {
                        if (i > 0) {
                            lines[eindexes[i]] = lines[eindexes[i]].substring(trimsize);
                        }

                        if (lines[eindexes[i]].substr(-2) == "|\r" && lines[eindexes[i]].substr(-3) != "||\r" ) {
                            lines[eindexes[i]] = lines[eindexes[i]].slice(0, -1);
                            lines[eindexes[i]] = lines[eindexes[i]] + "\r";
                        }

                        estring += lines[eindexes[i]].replace(/\s/g, "");
                    }
                }

                getDebug('Building intro... Got measure count: ' + (lastmeasure+2), 1);
                for (var i = pos; i <= introlastindex; i++) { 
                    if (lines[i] !== undefined) {
                        if (lines[i].indexOf('time') > -1) {
                            getDebug('Got time line: ' + lines[i].substr(lines[i].indexOf("time") + 1), 1);
                            var atime = lines[i].substr(lines[i].indexOf("time") + 1).match(/\d+\/\d+/);
                            if (atime !== null) {
                                var toptime = atime[0].split('/')[0];
                                var lowtime = atime[0].split('/')[1];
                                timeratio = toptime/lowtime;
                                getDebug('got time: ' + toptime + '/' + lowtime + ' so ratio: ' + timeratio + ' compared to 4/4 tab', 1);
                            }
                        }
                        if (lines[i].indexOf('tempo') > -1) {
                            getDebug('Got tempo line: ' + lines[i].substr(lines[i].indexOf("tempo") + 1), 1);
                            tempo = lines[i].substr(lines[i].indexOf("tempo") + 1).match(/\d+/);
                            if (tempo !== null) {
                                getDebug('got tempo: ' + tempo, 1);
                            }
                        }
                        introstring += lines[i] + "<br>";
                    }
                }

                tabfail = 1; // Failed to get tempo/timing

                if (lastmeasure !== undefined) {
                    tabfail = 0;

                    getDebug('Determining proper tab duration for scrolling', 1);
                    if (timeratio == null) {
                        tabfail = 1;
                        timeratio = 1;
                    }
                    if (tempo == null) {
                        tabfail = 1;
                        tempo = 100;
                    }
                    tabdur = Math.round((4*timeratio*(lastmeasure+2)*60)/tempo);
                    getDebug('Got ' + tabdur + ' seconds for measure|tempo|ratio ' + (lastmeasure+2) + "|" + tempo + "|" + timeratio,1);
                }

                if (legendendindex == 0) {
                    legendendindex = lines.length;
                }


                getDebug('Legend set from line ' + legendstartindex + ' to line ' + legendendindex, 1);

                for (var i = legendstartindex; i <= legendendindex; i++) { 
                    if (lines[i] !== undefined) {
                        legendstring += lines[i] + "<br>";
                    }
                }

                if (error === 0) {
                    // Getting doublebars. TODO Move somewhere more appropriate?
                    var regex = /\|\|/g, result, highest;
                    while ( (result = regex.exec(etstring)) ) {
                        dbpos.push(result.index+15); //Compensate for blankString
                        getDebug("Found || at " + result.index, 1);
                        highest = (result.index+15);
                    }

                    // Generating output
                    var blankString = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    if (veriteration == 0) {
                        $('body').html('<a href="./app_index.htm" style="font-weight:bold; font-size:24px;">Return to Classtab</a><br><hr><br>');
                    }
                    $('body').append('<div><pre style="line-height:80%">' + introstring + '</pre><br><div id="scrolltab' + veriteration + '" style="overflow: scroll; font-size:20px;"><pre style="white-space: nowrap;">' + blankString + topstring + '<br>' + blankString + etstring + '<br>' + blankString + bstring + '<br>' + blankString + gstring + '<br>' + blankString + dstring + '<br>' + blankString + astring + '<br>' + blankString + estring + '</pre><br><br></div><br><button id="backbtn' + veriteration + '" type="button" style="line-height:100%; width:140px; margin-left:5px; margin-top:2px; margin-right:2px; height:140px; font-size:20px; font-weight:bold; float:left;">Go to previous double barline</button><button id="tabbtn' + veriteration + '" type="button" onclick="scrollTab(0,' + veriteration + ')" style="line-height:100%; width:140px; margin-left:5px; margin-top:2px; margin-right:2px; height:140px; font-size:20px; font-weight:bold; float:left;">Start scrolling</button>');
                    
                    if (tabdur > 20) {
                        if (tabfail === 0) {
                            $('body').append('<div style="float:left;padding-left:10px;font-size:20px;">&nbsp;Scroll for <input type="number" name="tabtime' + veriteration + '" style="width:100px; font-size:36px;" value="' + tabdur + '"></input>&nbsp;seconds total<br><p style="font-weight:bold"> *Expected duration from given tempo/timing</p></div>');
                        } else {
                            $('body').append('<div style="float:left;padding-left:10px;font-size:20px;">&nbsp;Scroll for <input type="number" name="tabtime' + veriteration + '" style="width:100px; font-size:36px;" value="' + tabdur + '"></input>&nbsp;seconds total<br><p> *Expected duration at 100bpm, 4/4 measures</p></div>');
                        }
                    } else {
                        $('body').append('<div style="float:left;padding-left:10px;font-size:20px;">&nbsp;Scroll for <input type="number" name="tabtime' + veriteration + '" style="width:100px; font-size:36px;" value="40"></input>&nbsp;seconds total<br></div>');
                    }
                
                    $('body').append('<br style="clear:both;"><pre style="line-height:80%;">' + legendstring + '</pre></div>');
                   
                    if (hasotherver == 0) {
                        $('body').append('<hr><p style="font-weight:bold">Generated by Tabreader beta-0.5, maintained by Maxime Bergeron</p>');
                        $('body').append('<style>@media only screen and (max-device-width: 480px) {#scrolltab{font-size:24px;}}</style>');
                    }
                    window.scrollTo(0, 0);

                    //Setting the previous dbar button
                    $('#backbtn' + veriteration).on('click', function() {
                        var currentPos = $('#scrolltab' + veriteration).scrollLeft();
                        var fullWidth = document.getElementById('scrolltab' + veriteration).scrollWidth - document.getElementById('scrolltab' + veriteration).clientWidth;
                        var toScroll, nextPos, lastPos;
                        for (var i = 0; i < dbpos.length; i++) {
                            var nextPos = Math.round((dbpos[i]/highest)*fullWidth);
                            console.log("DBPOS " + dbpos[i] + " highest " + highest + ", currentpos " + currentPos + " and nextpos : " + nextPos + " fullwidth " + fullWidth);
                            if (currentPos <= nextPos) {
                                getDebug("Found higher || position at " + nextPos + ", using lastPos " + lastPos);
                                toScroll = lastPos;
                                break;
                            }

                            lastPos = nextPos;
                        }

                        if (toScroll === null) {
                            $('#backbtn' + veriteration).attr('disabled', true);
                        } else {
                            getDebug("Scrolltab width: " + fullWidth + ", first dbpos: " + dbpos[0] + " highest dbpos: " + highest + ". Pos to scroll: " + toScroll, 1);
                            if (!hasanim) {
                                $('div#scrolltab' + veriteration).animate({scrollLeft: toScroll},{"duration":100, "easing":"linear"});
                            } else {
                                $('div#scrolltab' + veriteration).stop();
                                $('div#scrolltab' + veriteration).animate({scrollLeft: toScroll},{"duration":100, "easing":"linear"});
                                setTimeout(function() {
                                    scrollTab(0, veriteration);
                                },200);
                            }
                        }
                        getDebug("clicked hasanim: " + hasanim + " toscroll: " + toScroll);
                    });

                    if (hasotherver == 1) {
                        $('#backbtn' + veriteration).attr('disabled', true);
                        veriteration++;
                        if (veriteration <= 3) { //LIMIT TO 3 VERSIONS
                            gettab(tabref,otherverindex,athis);
                        }
                    }
                }

            } else {
            	$(athis).html(' Tab not yet compatible! ');
    			$(athis).css('color', 'red');
            }
        }
    }); 
}

function scrollTab(isanimated, veriter) {
    hasanim = !isanimated;

    if (isanimated === 0) {
        var time = $('input[name="tabtime' + veriter + '"]').val()*1000;
        var percentscrolled = 100;
        if ($('div#scrolltab' + veriter).scrollLeft() != 0) {
            percentscrolled = 100-($('div#scrolltab' + veriter).scrollLeft()/document.getElementById('scrolltab' + veriter).scrollWidth)*100;
        }
        getDebug("Current position: " + $('div#scrolltab' + veriter).scrollLeft() + " and inverted calculated percentage: " + percentscrolled, adebug);
        $('div#scrolltab' + veriter).animate({
            scrollLeft: document.getElementById('scrolltab' + veriter).scrollWidth //- $('div#scrolltab').scrollLeft()
        }, { "duration": (time*(percentscrolled/100)), "easing": "linear" });
        $('#tabbtn' + veriter).html('Stop scrolling');
        $('#tabbtn' + veriter).attr('onclick', 'scrollTab(1,' + veriter + ')');
    } else {
        $('div#scrolltab' + veriter).stop();
        $('#tabbtn' + veriter).html('Start scrolling');
        $('#tabbtn' + veriter).attr('onclick', 'scrollTab(0,' + veriter + ')');
    }
}

function getDebug(string, debug) {
    if (adebug >= debug) {
        console.log(string);
    }
}

String.prototype.padRight = function(l,c) {return this+Array(l-this.length+1).join(c||" ")};

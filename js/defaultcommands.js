let txtFile = ["about.txt", "welcome.txt", "projects.txt"];
let directories = ["/", "/stanouz"]; 


function cat(args) {
  let path = window.location.pathname + "terminalfiles/";
  

  if (args[0] == null) {
    cmdDone();
    return;
  }

  path = path + args[0];
  $.ajax(path)
  .done(function(data) {
    terminalPrint(data);
  })
  .fail(function() {
    terminalPrint(args[0] + " does not exist or there was an error trying to access it.");
  })
  .always(function() {
    cmdDone();
  });
}

function ls(args) {

  for (var v in txtFile) {
    let str = txtFile[v];
    if ((args.length < 1 || args[0] != "-a") && str.match(/^(\.+)/gm)) {
      continue;
    }

    str = `<a class="lsfile" href="#" onclick="clickCmd('cat ` + str + `')">` + str + `</a>`

    terminalPrint(str + "&#9;", false);
  }


  for (var d in directories) {
    let str = directories[d];
    str = `<a class="lsdir" href="#" onclick="clickCmd('cd ` + str + `')">` + str + `</a>`;
    terminalPrint(str + "&#9;", false);
  }



  terminalPrint("");
  cmdDone();

  
}

function cd(args) {

  if(args.length>0){
    if(args[0] < "/"){
      args = '/'+args;
    }
  }
  
  document.location.href = "https://stanouz.github.io"+args;
  cmdDone();
}

function help() {
  let i = 1;
  for (var c in cmds) {
    var notlast = (i != Object.keys(cmds).length);
    var str = `<a href="#" class="helpcmd" onclick="clickCmd('` + c + `')">` + c + `</a>`

    terminalPrint(str, !notlast);

    if (notlast) {
      terminalPrint(", ", false);
    }

    i++;
  }

  cmdDone();
}

function clickCmd(cmd) {
  autowriteQueue.push(cmd);
}

function ready() {
  addCmd("cat", cat);
  addCmd("ls", ls);
  addCmd("cd", cd);
  addCmd("help", help);
}

$(document).ready(ready);

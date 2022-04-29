let txtFile = ["/portfolio/welcome.txt",
               "/portfolio/about.txt", 
               "/portfolio/projects.txt"];

let directories = ["~",
                  "/portfolio"]; 


function cat(args) {
  let path = directory+"/";

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
  for (var d in directories) {
    let str = directories[d];
  
    const regex = `${directory}`;
    const found = str.match(regex);
    console.log(found);
    if(found && directory!="/"){
      continue;
    }

    


    str = `<a class="lsdir" href="#" onclick="clickCmd('cd ` + str + `')">` + str + `</a> &nbsp;`;
    terminalPrint(str + "&#9;", false);
  }

  for (var v in txtFile) {
    let str = txtFile[v];

    const regex = `${directory}\/.*\.txt`;
    const found = str.match(regex);
   
    if(!found){
      continue;
    }

    

    if ((args.length < 1 || args[0] != "-a") && str.match(/^(\.+)/gm)) {
      continue;
    }
    
    str = str.replace(/\/.*\//, "");
    console.log(str);

    str = `<a class="lsfile" href="#" onclick="clickCmd('cat ` + str + `')">` + str + `</a> &nbsp;`;

    terminalPrint(str + "&#9;", false);
  }



  terminalPrint("");
  cmdDone();

  
}

function cd(args) {
  let url = "https://stanouz.github.io";
  url = "";

  console.log(args);  
  if(args.length>0 && args < "~"){
    if(args[0].length>0){
      if(args[0] < "/"){
        args = '/'+args;
      } 
      document.location.href = args + ".html";
    }
  }
  else{
    if(directory!="/"){
      document.location.href = "/";
    }
      
  }
 
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

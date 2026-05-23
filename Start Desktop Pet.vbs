Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectDir = fso.GetParentFolderName(WScript.ScriptFullName)
command = "cmd /c cd /d """ & projectDir & """ && node scripts\start-electron.cjs ."
shell.Run command, 0, False

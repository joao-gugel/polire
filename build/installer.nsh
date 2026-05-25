!macro customInstall
  CreateShortCut "$SMSTARTUP\Polire.lnk" "$INSTDIR\Polire.exe"
!macroend

!macro customUnInstall
  Delete "$SMSTARTUP\Polire.lnk"
!macroend

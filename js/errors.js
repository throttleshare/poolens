// PoolLens Error Code Database
// Sources: Hayward, Pentair, Jandy official service manuals + tech bulletins
// Maytronics/Aiper: LED indicator patterns (no text codes on display)

window.ERROR_DB = {

  hayward: {
    label: "Hayward",
    color: "#1d4ed8",
    categories: {

      "H-Series Gas Heater": {
        models: ["H100FD","H150FD","H200FD","H250FD","H300FD","H350FD","H400FD","Universal H-Series","XE Series","H-Series Low NOx"],
        codes: [
          { code:"E01", name:"Ignition Failure",
            causes:["No gas supply / gas valve closed","Faulty igniter or ignition module","Dirty or corroded flame sensor","Gas pressure too low","Clogged burner orifices","Bad gas valve"],
            fix:["Check gas shutoff is open","Check gas pressure at manifold (should be 3.5\" WC natural gas, 10\" LP)","Clean flame sensor rod with fine steel wool","Inspect igniter gap (should be 1/8\")","Check for error E01 after holding reset — 3 strikes = lockout"],
            severity:"high", callpro:true },
          { code:"E02", name:"Thermostat Failed High",
            causes:["Sensor/thermostat stuck or shorted (reads temp too high)","Control board failure","Damaged temperature sensor wiring"],
            fix:["Check wiring harness connections to temp sensors","Test thermostat resistance (should read ~10kΩ at room temp)","Replace thermostat if reading out of range"],
            severity:"high", callpro:true },
          { code:"E03", name:"Thermostat Failed Low",
            causes:["Temp sensor open circuit (reads too low)","Damaged sensor wiring","Defective control board"],
            fix:["Inspect sensor connector at control board","Check sensor wire continuity","Replace sensor if resistance reads infinite (open)"],
            severity:"medium", callpro:true },
          { code:"E04", name:"High Limit Fault",
            causes:["Low or no water flow","Dirty or clogged filter (check pressure)","Closed valves restricting flow","Pump not running or losing prime","Scale buildup in heat exchanger","High limit switch failed"],
            fix:["Verify pump is running and primed","Check filter pressure (clean if >10 PSI above normal)","Open all water valves fully","Backwash filter","Check for air in system","Test high limit switch continuity"],
            severity:"high", callpro:false },
          { code:"E05", name:"Pressure Switch Open",
            causes:["Insufficient water flow","Pressure switch failed or stuck open","Air in the system","Pump losing prime","Clogged filter"],
            fix:["Ensure pump is running strong — listen for cavitation","Check filter pressure and clean if needed","Verify all valves are open","Bleed air from system","Jumper pressure switch to test if switch is faulty (professional only)","Replace pressure switch if flow is confirmed good"],
            severity:"high", callpro:false },
          { code:"E06", name:"Stack Flue Overheat",
            causes:["Blocked flue or exhaust","Recirculating flue gases (bad location / near wall)","Combustion air starvation","Dirty burners"],
            fix:["Clear any debris from flue outlet","Check minimum clearances to walls/enclosures","Inspect burners for carbon buildup","Ensure adequate combustion air supply"],
            severity:"high", callpro:true },
          { code:"E07", name:"Gas Valve Error",
            causes:["Gas valve not responding to control board","Bad gas valve coil","Wiring fault to gas valve"],
            fix:["Check 24V at gas valve terminals during call for heat","Test gas valve coil resistance (~20–40Ω)","Replace gas valve if coil reads open or shorted"],
            severity:"high", callpro:true },
          { code:"BD", name:"Bad Display / Communication Error",
            causes:["Loose display wiring connector","Moisture in display connector","Control board fault","Display board failure"],
            fix:["Disconnect and reconnect the display cable at both ends","Check for corrosion or moisture on connector pins","If fault persists, replace display board"],
            severity:"medium", callpro:false },
          { code:"SF", name:"Service Filter",
            causes:["Filter pressure too high (dirty filter)","Pressure differential switch triggered"],
            fix:["Backwash sand/DE filter or clean cartridge","Reset by cleaning filter — code clears automatically","If code persists after cleaning, check pressure switch calibration"],
            severity:"low", callpro:false },
          { code:"AGS", name:"Automatic Gas Shutoff",
            causes:["Heater was inactive for extended period (safety feature)","Pilot mode / vacation mode activated"],
            fix:["Press 'Pool' or 'Spa' button to restart","Check if unit is in AGS/Vacation mode in settings","Normal operation — not a fault"],
            severity:"low", callpro:false },
          { code:"HI", name:"Water Temperature High",
            causes:["Pool water already at or above set point","Thermostat overshot","High ambient temperature affecting sensor reading"],
            fix:["Normal — heater shut off at target temp","Lower set point if desired","If temp is NOT actually high, check temperature sensor"],
            severity:"low", callpro:false },
          { code:"LO", name:"Water Temperature Low / Low Ambient",
            causes:["Ambient temperature too low for safe operation","Water temp below 40°F operating floor","Sensor reading error"],
            fix:["Wait for ambient temp to rise above 40°F","Check sensor wiring if temp is normal but code persists","For heat pumps: normal if ambient is below 50°F"],
            severity:"low", callpro:false }
        ]
      },

      "HeatPro Heat Pump": {
        models:["HeatPro 50K","HeatPro 95K","HeatPro 110K","HeatPro 140K","HP31104T","HP31105T","HP21004T"],
        codes:[
          { code:"LO", name:"Low Pressure / Low Ambient",
            causes:["Ambient air temperature below 50°F (normal cutoff)","Low refrigerant charge","Dirty evaporator coil (reduced airflow)","Refrigerant leak"],
            fix:["Check ambient temp — below 50°F is normal shutdown","Clean evaporator coil fins with garden hose (spray outward)","If ambient is warm and code persists: refrigerant issue — call HVAC tech"],
            severity:"medium", callpro:true },
          { code:"HI", name:"High Discharge Pressure",
            causes:["High ambient temperature (above 105°F)","Dirty condenser coil (evaporator)","Low water flow through heat exchanger","Refrigerant overcharge"],
            fix:["Clean evaporator coil fins","Check water flow rate through heat pump (need min 20 GPM)","Ensure no restrictions on water side unions","Normal above 105°F ambient — wait for cooler conditions"],
            severity:"high", callpro:true },
          { code:"FLO", name:"Flow Error / No Water Flow",
            causes:["Pump not running","Flow switch failed","Insufficient flow (< 20 GPM typically)","Closed valves","Dirty filter","Air in system"],
            fix:["Verify pump is running and primed","Check all valves are open","Clean filter","Minimum flow rate per spec sheet","Test flow switch continuity","Bypass flow switch temporarily to diagnose (pro only)"],
            severity:"high", callpro:false },
          { code:"LP", name:"Low Pressure Switch Tripped",
            causes:["Low refrigerant pressure","Refrigerant leak","Restriction in refrigerant circuit"],
            fix:["Do not add refrigerant without finding the leak first","Call licensed HVAC technician — this is a sealed system fault"],
            severity:"high", callpro:true },
          { code:"HP", name:"High Pressure Switch Tripped",
            causes:["Dirty evaporator coil","High ambient temp","Water side flow restriction","Refrigerant overcharge"],
            fix:["Clean evaporator coils","Check water flow","High ambient is normal — unit will restart when conditions improve","Call HVAC tech if persists after cleaning"],
            severity:"high", callpro:true },
          { code:"HH", name:"High Head Pressure",
            causes:["Extremely dirty evaporator coil","Very high ambient temperature","Refrigerant overcharge"],
            fix:["Thoroughly clean evaporator coil","Check ambient temp (>105°F normal shutdown)","HVAC tech needed if coil is clean and temp is normal"],
            severity:"high", callpro:true }
        ]
      },

      "TriStar / Super Pump VS": {
        models:["TriStar VS 1.85HP","EcoStar VS","Super Pump VS","MaxFlo VS","EcoStar SVRS"],
        codes:[
          { code:"OVER CURRENT", name:"Motor Over Current",
            causes:["Impeller clogged with debris","Motor bearings failing","Voltage too low","Running at RPM too high for restriction in system"],
            fix:["Remove pump basket and clear debris","Check impeller — remove pump and clear any blockage","Verify voltage at motor terminals matches nameplate","Lower max RPM setting if plumbing is undersized"],
            severity:"high", callpro:false },
          { code:"PRIMING", name:"Pump Not Priming",
            causes:["Low water level","Air leak in suction line","Closed suction valve","Debris clog at skimmer or main drain"],
            fix:["Check pool water level (must cover skimmer)","Inspect suction side fittings and unions for air leaks","Open suction valves fully","Clear skimmer basket and main drain"],
            severity:"medium", callpro:false },
          { code:"DRIVE TEMP", name:"Drive Temperature Fault",
            causes:["Pump running in enclosed space with no airflow","Ambient temperature too high","Drive cooling fan failure"],
            fix:["Ensure pump has adequate ventilation clearance","Pump must not be in sealed enclosure without airflow","Check cooling fan on drive — replace if not spinning"],
            severity:"high", callpro:false }
        ]
      }
    }
  },

  pentair: {
    label: "Pentair",
    color: "#0369a1",
    categories: {

      "MasterTemp / Max-E-Therm Gas Heater": {
        models:["MasterTemp 125","MasterTemp 175","MasterTemp 250","MasterTemp 300","MasterTemp 400","Max-E-Therm 125","Max-E-Therm 175","Max-E-Therm 250","Max-E-Therm 300","Max-E-Therm 400"],
        codes:[
          { code:"E01", name:"Ignition Failure",
            causes:["No gas supply","Gas valve not opening","Faulty hot surface igniter (HSI)","Dirty or failed flame sensor","Low gas pressure"],
            fix:["Check gas shutoff valve is open","Verify gas pressure (3.5\" WC natural, 10\" LP at manifold)","Inspect HSI element — should glow orange, replace if cracked","Clean flame rod with emery cloth","Check for multiple ignition lockout (will require manual reset)"],
            severity:"high", callpro:true },
          { code:"E02", name:"High Temperature Limit",
            causes:["Inadequate water flow","Dirty filter","Hi-limit switch tripped","Scale buildup in heat exchanger"],
            fix:["Check pump running and flow rate","Clean or backwash filter","Open all return valves fully","Allow heater to cool 15 minutes before reset","Inspect heat exchanger for scale buildup"],
            severity:"high", callpro:false },
          { code:"E03", name:"Pressure Switch Open",
            causes:["Low water flow","Pump not running","Closed valves","Filter pressure too high","Pressure switch malfunction"],
            fix:["Confirm pump is operating","Open all water valves fully","Clean or backwash filter","Check and clean pump basket","Test pressure switch — verify 24V signal when flow present"],
            severity:"high", callpro:false },
          { code:"E04", name:"Ignition Lockout",
            causes:["Three consecutive ignition failures triggered safety lockout","Same causes as E01"],
            fix:["Wait 1 hour for automatic retry OR press reset","If E01 kept recurring, diagnose gas/igniter before reset","Manual reset: hold 'Mode' button 5 seconds on some models"],
            severity:"high", callpro:true },
          { code:"E05", name:"Stack Flue Temperature Fault",
            causes:["Blocked or restricted flue exhaust","Recirculating combustion gases","Combustion air restriction","Dirty burner"],
            fix:["Clear any debris or nest from flue outlet","Check clearances per installation manual","Inspect burner tray for carbon / debris","Ensure adequate combustion air — sealed equipment rooms need air vents"],
            severity:"high", callpro:true },
          { code:"E06", name:"Sensor Failure",
            causes:["Temperature sensor (thermistor) failed open or short","Damaged sensor wiring","Moisture in control panel"],
            fix:["Check thermistor resistance — should be ~10kΩ at 25°C (77°F)","Inspect wiring harness for pinch or corrosion","Replace thermistor if out of spec","Check for moisture ingress in control compartment"],
            severity:"medium", callpro:true },
          { code:"E07", name:"High Limit Fault",
            causes:["Water temperature exceeded high limit switch setting (typically 135°F)","Hi-limit switch failed closed or open","Same flow issues as E02"],
            fix:["Allow unit to cool completely (20-30 minutes)","Check water flow before resetting","Test hi-limit switch resistance (should be closed/zero Ω when cool)","Replace hi-limit switch if faulty","Do NOT bypass — safety device"],
            severity:"high", callpro:true },
          { code:"BD", name:"Bad Display Connection",
            causes:["Display cable loose or disconnected","Moisture on display connector","Failed display board or control board"],
            fix:["Check display cable at both ends — disconnect/reconnect","Inspect for corrosion or moisture on connector","Try replacing display board first (cheaper) before control board"],
            severity:"medium", callpro:false },
          { code:"SF", name:"Service Filter",
            causes:["Filter differential pressure too high","Dirty filter cartridge, sand, or DE grids"],
            fix:["Backwash sand or DE filter","Clean cartridge filter","Reset is automatic after filter service","If code persists: check pressure switch calibration"],
            severity:"low", callpro:false },
          { code:"LO", name:"Low Temperature Cutoff",
            causes:["Ambient temperature below minimum operating temp","Sensor reading low","Normal cold-weather shutdown"],
            fix:["Normal below 40°F ambient","Check temperature sensor if ambient is warm and code persists"],
            severity:"low", callpro:false },
          { code:"HI", name:"High Temperature — Setpoint Reached",
            causes:["Water reached desired setpoint","Normal operation"],
            fix:["Normal shutdown — not an error","If pool is too hot, lower setpoint"],
            severity:"low", callpro:false }
        ]
      },

      "UltraTemp Heat Pump": {
        models:["UltraTemp 70","UltraTemp 90","UltraTemp 110","UltraTemp 120","UltraTemp 140"],
        codes:[
          { code:"LO TEMP", name:"Low Ambient Temperature",
            causes:["Air temperature below minimum operating range (~45°F)","Normal cold-weather shutdown"],
            fix:["Wait for ambient temperature to rise above 45°F","Normal operation — unit will restart automatically"],
            severity:"low", callpro:false },
          { code:"HIGH PRESS", name:"High Refrigerant Pressure",
            causes:["Dirty evaporator coil (reduced airflow)","High ambient temperature","Water flow restriction","Refrigerant overcharge"],
            fix:["Clean evaporator coil fins with garden hose","Check water flow — minimum GPM per spec","Call HVAC tech if coil clean and temps normal"],
            severity:"high", callpro:true },
          { code:"LOW PRESS", name:"Low Refrigerant Pressure",
            causes:["Low refrigerant — possible leak","Restriction in refrigerant circuit","Extremely low ambient temp"],
            fix:["Do not add refrigerant without finding leak","Call licensed HVAC/refrigeration technician"],
            severity:"high", callpro:true },
          { code:"FLOW", name:"Water Flow Error",
            causes:["Pump not running","Flow switch failure","Low water flow rate","Closed or restricted valves"],
            fix:["Verify pump running at adequate speed","Open all suction and return valves","Check and clean filter","Test flow switch","Min flow rate per model spec (typically 20-30 GPM)"],
            severity:"high", callpro:false }
        ]
      },

      "IntelliFlo VSF Pump": {
        models:["IntelliFlo VSF 3HP","IntelliFlo VS 3HP","IntelliFlo VS+SVRS","IntelliFlo i2","IntelliFlo3 VSF"],
        codes:[
          { code:"PRIMING", name:"Pump Not Priming",
            causes:["Air in suction line","Low pool water level","Closed suction valves","Debris blocking impeller"],
            fix:["Check water level at skimmer","Open suction valves","Check for air leaks at unions and lid O-ring","Remove pump lid and check for debris at impeller"],
            severity:"medium", callpro:false },
          { code:"ALARM 0001", name:"Undercurrent — No Flow Detected",
            causes:["Impeller blocked","Suction side closed","Low speed too low for priming"],
            fix:["Check for debris at impeller","Open suction valves","Increase minimum RPM to ensure priming"],
            severity:"medium", callpro:false },
          { code:"ALARM 0002", name:"Overcurrent — Motor Drawing Too Much Current",
            causes:["Impeller jammed with debris","Bearings failing","Voltage too low or high","RPM set too high for system"],
            fix:["Remove debris from impeller (remove pump lid and basket)","Check supply voltage — should match motor nameplate","Lower max RPM","If bearings: motor replacement needed"],
            severity:"high", callpro:false },
          { code:"ALARM 0003", name:"Overvoltage",
            causes:["Supply voltage too high","Lightning surge","GFCI or wiring issue"],
            fix:["Check supply voltage at motor terminals","Verify correct voltage for motor (115V or 230V)","Check GFCI breaker"],
            severity:"high", callpro:true },
          { code:"ALARM 0004", name:"Drive Temperature High",
            causes:["Inadequate airflow around pump","Pump in sealed enclosure","High ambient temperature"],
            fix:["Ensure minimum clearance around pump (6\" all sides)","Do not enclose pump without ventilation","Lower max RPM temporarily to reduce heat"],
            severity:"high", callpro:false }
        ]
      }
    }
  },

  jandy: {
    label: "Jandy / Zodiac",
    color: "#059669",
    categories: {

      "LXi / LRZ Gas Heater": {
        models:["LXi 125","LXi 175","LXi 250","LXi 325","LXi 400","LRZ125","LRZ175","LRZ250","LRZ325","LRZ400"],
        codes:[
          { code:"E01", name:"Ignition Failure",
            causes:["No gas","Gas valve fault","Igniter fault","Flame sensor dirty"],
            fix:["Verify gas supply and pressure","Check igniter — glow should appear orange during startup","Clean flame sensor","Check gas valve opens (24V to valve coil during call)"],
            severity:"high", callpro:true },
          { code:"E02", name:"High Limit",
            causes:["Inadequate water flow","Dirty filter","High limit switch tripped","Sensor wiring issue"],
            fix:["Check pump flow","Clean filter","Allow to cool and reset","Check all valves open"],
            severity:"high", callpro:false },
          { code:"E03", name:"Pressure / Flow Switch Open",
            causes:["Low water flow","Pump not running or losing prime","Pressure switch failure"],
            fix:["Verify pump operation","Open all valves","Check filter pressure","Test flow switch"],
            severity:"high", callpro:false },
          { code:"E04", name:"Sensor Fault",
            causes:["Water temperature sensor failed","Sensor wiring damaged","Moisture in electronics"],
            fix:["Test sensor resistance (~10kΩ at room temp)","Check wiring continuity","Replace sensor if out of spec"],
            severity:"medium", callpro:true },
          { code:"E05", name:"Flue / Stack Fault",
            causes:["Blocked flue","Combustion air issue","Dirty burner"],
            fix:["Clear flue obstruction","Check installation clearances","Clean burner tray"],
            severity:"high", callpro:true },
          { code:"SFS", name:"Service Filter Switch",
            causes:["Dirty filter — pressure differential too high"],
            fix:["Backwash sand/DE filter or clean cartridge","Code clears when filter is serviced"],
            severity:"low", callpro:false },
          { code:"AGS", name:"Auto Gas Shutoff",
            causes:["Heater idle for extended period (safety feature)"],
            fix:["Press any mode button to restart — normal safety feature"],
            severity:"low", callpro:false },
          { code:"SNSR", name:"Sensor Error",
            causes:["Temperature sensor open or shorted"],
            fix:["Test sensor resistance — should be ~10kΩ at 77°F","Replace if reading open (∞) or shorted (<100Ω)"],
            severity:"medium", callpro:true }
        ]
      },

      "VS FloPro Pump": {
        models:["VS FloPro 1.85HP","VSFHP185","FloPro VS"],
        codes:[
          { code:"ALARM", name:"General Alarm",
            causes:["Check display for sub-code or description","Motor, drive, or flow issue"],
            fix:["Read sub-display for specific fault","Common: overcurrent (debris), priming (air leak), drive temp (ventilation)"],
            severity:"medium", callpro:false },
          { code:"PRIMING", name:"Pump Not Priming",
            causes:["Air in suction line","Low water level","Closed valves","Blocked suction"],
            fix:["Check water level and suction line","Open all valves","Check for air leaks"],
            severity:"medium", callpro:false }
        ]
      }
    }
  },

  maytronics: {
    label: "Maytronics (Dolphin)",
    color: "#7c3aed",
    categories: {

      "Dolphin Robot Cleaners": {
        models:["Dolphin Nautilus CC","Dolphin Nautilus CC Plus","Dolphin M600","Dolphin S300i","Dolphin Sigma","Dolphin Active 20","Dolphin Premier","Dolphin Active 30i"],
        note:"Maytronics uses LED indicator patterns — no text codes on display. Match your indicator lights below.",
        codes:[
          { code:"LED: Solid Red", name:"Motor/Drive Fault",
            causes:["Motor shaft jammed (tangled cable or debris)","Drive board failure","Impeller blocked"],
            fix:["Remove robot from pool","Check for tangled cable around roller brushes","Clear any debris from impeller","Reset by unplugging 30 seconds","If persists: drive board replacement"],
            severity:"high", callpro:false },
          { code:"LED: Blinking Red (slow)", name:"Low Water Temperature",
            causes:["Water temperature below operating minimum (~41°F)","Normal cold-water protection"],
            fix:["Wait for water temp to rise above 41°F","Normal — not a fault"],
            severity:"low", callpro:false },
          { code:"LED: Blinking Red (fast)", name:"Communication / Connectivity Fault",
            causes:["App communication issue","Cable fault","Power supply issue"],
            fix:["Unplug and replug power supply","Restart the MyDolphin+ app and reconnect","Check cable for damage or kinking","Test with a different power supply if available"],
            severity:"medium", callpro:false },
          { code:"LED: Red + Blue alternating", name:"Charging / Power Supply Issue",
            causes:["Power supply fault","Incorrect power supply voltage","Internal battery issue"],
            fix:["Check power supply output voltage matches robot spec","Use only OEM Maytronics power supply","If power supply confirmed good: internal fault, contact Maytronics"],
            severity:"high", callpro:true },
          { code:"LED: Solid Blue", name:"Normal Operation",
            causes:["Robot is running normally"],
            fix:["No action needed"],
            severity:"low", callpro:false },
          { code:"LED: Blinking Blue", name:"Cycle Complete",
            causes:["Cleaning cycle finished — normal"],
            fix:["Remove from pool and clean filter basket/cartridge"],
            severity:"low", callpro:false },
          { code:"No LED / Won't Start", name:"No Power",
            causes:["GFCI outlet tripped","Power supply failure","Faulty connection at swivel","Float cable damage"],
            fix:["Test GFCI outlet — press reset button on outlet","Inspect cable for cuts or damage (especially at swivel)","Test power supply output with multimeter","Check for corrosion at cable connections"],
            severity:"high", callpro:false }
        ]
      }
    }
  },

  aiper: {
    label: "Aiper",
    color: "#0891b2",
    categories: {

      "Aiper Robot Cleaners": {
        models:["Seagull Pro","Seagull Plus","Scuba S1","Scuba E1","Scuba N1","Surfer 1","Surfer M1","Smart 30 Pro","HJ2111"],
        note:"Aiper uses LED indicator patterns. Indicator behavior varies by model — check model-specific manual. Common patterns below.",
        codes:[
          { code:"LED: Blinking Red (3×)", name:"Motor Blocked / Impeller Jam",
            causes:["Debris wrapped around brushes or impeller","Wheel/brush locked"],
            fix:["Remove from pool","Clear debris from brushes, tracks, and impeller","Check suction intake for blockage","Reset by holding power button 3 seconds"],
            severity:"medium", callpro:false },
          { code:"LED: Blinking Red (continuous)", name:"Cliff Detection Error",
            causes:["Robot stuck on stairs or ledge","Sensor dirty","Slope too steep"],
            fix:["Place robot on flat pool floor away from steps","Clean cliff detection sensors on underside","If pool has unusual geometry, check compatibility"],
            severity:"low", callpro:false },
          { code:"LED: Red solid", name:"General Fault / Motor Error",
            causes:["Internal motor issue","Communication failure between motor and controller","Overheating"],
            fix:["Remove from pool and let cool 15 minutes","Unplug from charging station","Clear any debris from all rotating parts","If persists after reset: contact Aiper support"],
            severity:"high", callpro:true },
          { code:"No power / won't charge", name:"Charging Fault",
            causes:["Charging dock contacts corroded or misaligned","Battery aged (battery life ~2-3 years)","Charging cable damaged"],
            fix:["Clean charging dock contacts with dry cloth","Ensure robot is properly seated on dock","Check charging cable for damage","If battery won't hold charge: replacement battery needed"],
            severity:"medium", callpro:false },
          { code:"LED: Blue blinking (Seagull Pro)", name:"Cycle Complete",
            causes:["Normal — cleaning cycle finished"],
            fix:["Remove robot, clean filter basket, rinse robot"],
            severity:"low", callpro:false }
        ]
      }
    }
  },

  raypak: {
    label: "Raypak",
    color: "#dc2626",
    categories: {
      "Raypak Gas Heater": {
        models:["Raypak 106A","Raypak 156A","Raypak 206A","Raypak 266A","Raypak 336A","Raypak 406A","Raypak Digital","RP2100","RP2350"],
        codes:[
          { code:"E1", name:"Ignition Failure / Lockout",
            causes:["Gas supply issue","Failed igniter","Faulty gas valve","Low gas pressure"],
            fix:["Check gas supply and pressure","Inspect igniter element (hot surface igniter)","Check gas valve operation","Manual reset: hold 'Reset' button"],
            severity:"high", callpro:true },
          { code:"E2", name:"High Limit",
            causes:["Low water flow","Dirty filter","Hi-limit switch tripped"],
            fix:["Check pump and flow","Clean filter","Allow to cool and reset"],
            severity:"high", callpro:false },
          { code:"E3", name:"Pressure Switch Open",
            causes:["Low water flow","Pressure switch failure","Air in system"],
            fix:["Verify pump running","Open all valves","Clear filter","Test pressure switch"],
            severity:"high", callpro:false },
          { code:"E4", name:"Temperature Sensor Fault",
            causes:["Sensor open or shorted","Damaged wiring"],
            fix:["Test sensor resistance (~10kΩ at 77°F)","Replace if out of spec"],
            severity:"medium", callpro:true },
          { code:"E5", name:"Venter / Flue Fault (induced draft models)",
            causes:["Flue blocked","Venter motor failure","Pressure switch in venter circuit"],
            fix:["Check flue for obstruction","Test venter motor (should spin freely)","Check pressure tubing to venter switch for blockage"],
            severity:"high", callpro:true }
        ]
      }
    }
  },

  beatbot: {
    label: "Beatbot",
    color: "#f59e0b",
    categories: {
      "Beatbot Robot Cleaners": {
        models:["AquaSense","AquaSense 2","AquaSense Pro","AquaSense S2","iSkim Ultra"],
        note:"Beatbot robots use LED indicator patterns for physical units; app-connected models (AquaSense Pro, AquaSense S2) also show alphanumeric error codes in the Beatbot app.",
        codes:[
          { code:"LED: Solid Red", name:"Motor Blocked / Impeller Jam",
            causes:["Debris wrapped around impeller or brushes","Drive wheel obstructed","Robot caught on drain cover or obstacle"],
            fix:["Remove robot from pool immediately","Clear all debris from impeller, brushes, and drive wheels","Check suction inlet for blockage","Reset by unplugging for 30 seconds and restarting","If impeller is visibly jammed, gently rotate by hand to free"],
            severity:"high", callpro:false },
          { code:"LED: Blinking Red", name:"Cliff Detection or Water Entry Error",
            causes:["Robot detected pool edge, stairs, or abrupt ledge","Water ingress into electronics compartment (waterproofing breach)","Cliff sensor dirty or obscured"],
            fix:["Place robot on flat pool floor away from steps or ledges","Clean cliff detection sensors on underside with soft cloth","Inspect seals and gaskets for damage if water ingress is suspected","Do not run robot on pools with steep or non-standard geometry without checking compatibility"],
            severity:"medium", callpro:false },
          { code:"LED: Red + White alternating", name:"Low Battery / Charging Error",
            causes:["Battery charge critically low","Charging contacts corroded or misaligned","Charging cable or power supply fault","Battery aged or capacity degraded"],
            fix:["Return robot to charging dock immediately","Clean charging contacts on both robot and dock with dry cloth","Ensure robot is fully seated on dock","Inspect charging cable for damage","If battery will not charge after 4 hours, battery replacement may be needed"],
            severity:"medium", callpro:false },
          { code:"No power / won't start", name:"No Power",
            causes:["GFCI outlet tripped","Power supply failed","Float cable damaged","Charging dock fault","Battery fully depleted (not charged before first use)"],
            fix:["Press reset button on GFCI outlet and test outlet with another device","Inspect float cable for cuts or pinches","Verify power supply output with multimeter if available","Charge robot fully before first use (4+ hours)","Try a different outlet on a different circuit"],
            severity:"high", callpro:false },
          { code:"E01", name:"Brush Motor Overload",
            causes:["Brush roller jammed with hair, string, or debris","Brush roller bearing worn or seized","Brush drive belt broken or slipped"],
            fix:["Remove robot and clear all debris from brush roller","Check brush roller for free rotation — it should spin easily by hand","Inspect brush drive belt condition and seating","Reset via app: Settings > Reset Robot, or unplug for 60 seconds"],
            severity:"medium", callpro:false },
          { code:"E02", name:"Drive Motor Fault",
            causes:["Drive motor overheated","Debris jammed in drive wheel or track","Drive motor bearing failure","Internal drive board fault"],
            fix:["Remove robot from pool and let cool 20 minutes","Clear all debris from drive wheels and tracks","Attempt restart — if E02 returns immediately, drive motor or board needs service","Contact Beatbot support — drive motor replacement is typically required"],
            severity:"high", callpro:true },
          { code:"E03", name:"Pump Motor Fault",
            causes:["Suction impeller blocked (leaves, large debris)","Pump motor overload from running dry","Internal pump fault"],
            fix:["Remove and clean debris tray and suction inlet thoroughly","Check impeller for obstruction — clear any blockage","Do not run robot outside of water (pump runs dry and overheats)","If E03 returns after cleaning, pump motor service needed"],
            severity:"high", callpro:true },
          { code:"E05", name:"Charging Fault",
            causes:["Charging dock contacts corroded or bent","Power supply output out of spec","Battery management system (BMS) fault","Ambient temperature too cold for charging (<40°F)"],
            fix:["Clean charging contacts with isopropyl alcohol","Allow robot to warm to room temperature before charging if stored in cold","Test with a known-good power supply","If charging fault persists after contact cleaning: contact Beatbot support for BMS evaluation"],
            severity:"medium", callpro:false },
          { code:"E07", name:"Communication Loss (Wi-Fi / App Disconnected)",
            causes:["Wi-Fi network changed (SSID or password)","Robot out of Wi-Fi range during setup","App needs update","Router firewall blocking device communication","Robot firmware needs update"],
            fix:["Re-pair robot via Beatbot app: Settings > Add Device","Ensure 2.4 GHz Wi-Fi band is available (not 5 GHz only)","Update Beatbot app to latest version","Move router closer or add Wi-Fi extender near pool area","Check that router is not blocking local device communication"],
            severity:"low", callpro:false },
          { code:"LED: Solid Blue", name:"Normal Operation",
            causes:["Robot is running a cleaning cycle normally"],
            fix:["No action needed — robot is operating correctly"],
            severity:"low", callpro:false },
          { code:"LED: Blinking Blue", name:"Cycle Complete",
            causes:["Cleaning cycle has finished — normal end-of-cycle indicator"],
            fix:["Remove robot from pool","Open debris tray and empty collected debris","Rinse filter and tray with garden hose","Allow robot to dry before next use or storage"],
            severity:"low", callpro:false },
          { code:"App: Filter Full", name:"Debris Tray Full",
            causes:["Debris collection tray capacity reached","Heavy leaf or debris load in pool","Filter screen clogged reducing suction"],
            fix:["Remove robot from pool","Open debris tray door and empty all collected debris","Rinse tray and filter screen with hose until water runs clear","Reinstall tray and restart cycle"],
            severity:"low", callpro:false }
        ]
      }
    }
  },

  betta: {
    label: "Betta (BWT)",
    color: "#10b981",
    categories: {
      "Betta Robot Cleaners": {
        models:["Betta SE","Betta 2","Betta SE2","Betta Plus","Betta Cleaner"],
        note:"Betta robots (manufactured by Hammer / distributed under BWT brand) use LED indicator patterns and an audible buzzer. Most models are cordless with solar-assist charging. Betta SE and SE2 are surface skimmers; Betta Cleaner is a full in-pool robot.",
        codes:[
          { code:"LED: Blinking Red", name:"Low Battery — Charge Immediately",
            causes:["Battery charge level critically low","Robot has been running longer than battery capacity","Solar charge insufficient to maintain level (heavy cloud cover or shadowed pool)"],
            fix:["Remove robot from pool","Place on charging dock or connect charging cable","Allow minimum 4–6 hours charge before next use","Ensure solar panel is clean and unobstructed for solar-assist models"],
            severity:"medium", callpro:false },
          { code:"LED: Solid Red", name:"Drive Fault / Obstacle Stuck",
            causes:["Drive wheel or track jammed by debris","Robot wedged against wall, step, or drain cover","Drive motor stalled"],
            fix:["Remove robot from pool","Clear any debris from drive wheels, tracks, and undercarriage","Check that all wheels spin freely by hand","Reset by holding power button 5 seconds","Inspect pool for objects that could trap the robot"],
            severity:"high", callpro:false },
          { code:"LED: Red (3 blinks)", name:"Brush Blocked or Jammed",
            causes:["Hair, string, or fibrous debris wrapped around brush roller","Brush roller bearing worn","Brush drive mechanism fault"],
            fix:["Remove robot and cut away any wrapped hair or string with scissors","Spin brush roller manually — it should rotate freely","Clean brush roller housing and end caps","Replace brush roller if bearing is seized or bristles are heavily worn"],
            severity:"medium", callpro:false },
          { code:"Buzzer + Red LED", name:"Water Entry Alarm",
            causes:["Water has entered the electronics compartment","Seal or gasket damaged or displaced","Robot dropped or impacted before water entry"],
            fix:["Remove robot from pool immediately","Do NOT plug in or charge until fully dry","Allow robot to air-dry completely (24-48 hours minimum)","Inspect all seals, gaskets, and housing for cracks or damage","Contact Betta/BWT support — electronics water exposure may require professional service"],
            severity:"high", callpro:true },
          { code:"No power after full charge", name:"Battery or Charging Contact Issue",
            causes:["Battery has reached end of service life (typically 2–3 years)","Charging contacts on robot or dock are corroded or oxidized","Internal battery connection loose"],
            fix:["Clean charging contacts with fine sandpaper or isopropyl alcohol","Test with a different charging cable if available","If robot is 2+ years old and charge does not hold, battery replacement is likely needed","Contact Betta/BWT support for battery service options"],
            severity:"medium", callpro:false },
          { code:"Robot circles without moving forward", name:"Wheel / Track Slip or Brush Jam",
            causes:["One drive wheel or track has more resistance than the other (asymmetric drag)","Brush jam causing rotational bias","Track or wheel worn, cracked, or delaminated"],
            fix:["Remove robot and inspect both drive wheels/tracks for debris or damage","Clean and lubricate track joints if applicable","Check that brush roller spins freely — a jammed brush pulls the robot sideways","Replace worn or cracked tracks/wheels if found","Test on a flat surface out of water to isolate which side is dragging"],
            severity:"medium", callpro:false },
          { code:"Robot stays in corner", name:"Navigation Sensor Dirty or Blocked",
            causes:["Cliff or wall detection sensor covered in algae, debris, or scale","Sensor lens scratched or cloudy","Pool surface highly reflective (light-colored plaster) confusing sensors"],
            fix:["Remove robot and clean all sensors on underside and sides with soft damp cloth","Do not use abrasive cleaners on sensor lenses","Check that sensor ports are not blocked by debris buildup","If pool surface is very light-colored, check Betta compatibility documentation for reflective surfaces"],
            severity:"low", callpro:false },
          { code:"Solar charge not working", name:"Solar Panel Issue",
            causes:["Solar panel surface dirty, coated with sunscreen film, or covered by debris","Insufficient sunlight — overcast conditions, pool fully shaded","Panel or internal solar charge controller fault"],
            fix:["Clean solar panel with damp cloth — sunscreen and dust significantly reduce output","Position robot in direct sunlight for at least 3–4 hours for meaningful charge","Solar assist supplements but does not fully replace dock charging in low-light conditions","If panel is clean and conditions are sunny but charge does not occur: internal solar controller fault, contact BWT support"],
            severity:"low", callpro:false }
        ]
      }
    }
  },

  polaris: {
    label: "Polaris (Zodiac)",
    color: "#1d4ed8",
    categories: {
      "Polaris Pressure-Side Cleaners": {
        models:["Polaris 280","Polaris 380","Polaris 480","Polaris 3900 Sport","Polaris 65","Polaris 165","Polaris Quattro Sport"],
        note:"Polaris pressure-side cleaners require a dedicated booster pump (280/380/480/3900) or work off main pump return pressure (65/165). No electronic error codes — diagnosis is based on observed behavior.",
        codes:[
          { code:"Cleaner not moving", name:"Booster Pump Off or Drive Train Issue",
            causes:["Booster pump not running (for 280/380/480 models)","Feed hose kinked or disconnected","Drive belts broken or missing","Turbine/water wheel clogged","Water flow to cleaner too low"],
            fix:["Verify booster pump is running and circuit breaker is on","Check all hose connections at wall fitting and cleaner","Inspect all three drive belts — replace if cracked or broken","Remove turbine cover and clear debris from water wheel","Verify booster pump valve is open fully"],
            severity:"medium", callpro:false },
          { code:"Cleaner moves but bag not filling", name:"Backup Valve Stuck or Low Flow",
            causes:["Backup valve not cycling (stuck open or closed)","Water flow rate too low to fill bag","Bag torn or zipper open","Head float restricting intake","Debris deflector missing or misaligned"],
            fix:["Listen for backup valve clicking every 3-5 minutes — if silent, replace backup valve","Check flow rate — bag should inflate visibly while running","Inspect bag for tears and zipper closure","Remove and inspect head float — should be buoyant, not waterlogged","Confirm debris deflector is installed at intake throat"],
            severity:"medium", callpro:false },
          { code:"Cleaner climbs walls and gets stuck", name:"Water Chemistry or Tail Sweep Worn",
            causes:["Pool walls too slippery from algae or high pH (no traction)","Tail sweep worn or missing (tail sweep provides back-pressure to keep cleaner on floor)","Water pressure too high (overcorrects up walls)","Float tube waterlogged"],
            fix:["Treat pool chemistry — target pH 7.2-7.6, shock if algae present","Inspect tail sweep — replace if bristles worn below 1 inch","Reduce booster pump pressure if adjustable","Check float tube for water ingress — replace if waterlogged","Add a Polaris wing kit or deflector kit for chronic wall-climbing issues"],
            severity:"low", callpro:false },
          { code:"Backup valve not firing", name:"Backup Valve Timer or Wear",
            causes:["Backup valve timer set too infrequently or too frequently","Backup valve diaphragm worn or cracked","Debris lodged in backup valve seat","Low flow reducing valve actuation pressure"],
            fix:["Adjust backup valve timer — optimal is every 3-5 minutes (1/3 turn setting on most models)","Remove backup valve and inspect diaphragm — replace if cracked or stiff","Flush valve with clean water to clear debris","Test with a new backup valve if diagnosis is unclear — they are inexpensive and commonly replaced"],
            severity:"medium", callpro:false },
          { code:"Cleaner moves in circles", name:"Drive Belts Worn or One Wheel Not Turning",
            causes:["One drive belt broken, worn, or slipped off","One drive wheel seized or jammed","Wheel axle worn","Uneven pressure from head float position"],
            fix:["Remove cleaner from pool and inspect all three drive belts — all must be intact and correctly routed","Spin each wheel by hand — all should rotate freely","Replace all three drive belts as a set (they wear at similar rates)","Check wheel axle for debris binding","Re-seat head float in correct position"],
            severity:"medium", callpro:false },
          { code:"Head float above water line", name:"Water in Float — Replace",
            causes:["Head float has cracked or degraded and filled with water","UV degradation of float material over time"],
            fix:["Remove head float and shake — if you hear water sloshing inside, replace it","Float replacement is straightforward — unclip and swap","Water-filled float causes cleaner to drag along bottom and not cover pool properly"],
            severity:"low", callpro:false },
          { code:"Hose collapses", name:"Hose Swivel Restriction",
            causes:["Hose swivel joint too tight (restricts flow causing suction collapse)","Hose section kinked at connection point","Hose age — older hoses lose flexibility and kink more easily"],
            fix:["Check all swivel joints — they should rotate freely with minimal resistance","Do not over-tighten hose connections","Straighten hose sections and ensure no sharp bends","Consider replacing hose if it is more than 5 years old and repeatedly kinks"],
            severity:"low", callpro:false }
        ]
      },

      "Polaris Robot Cleaners (i-series)": {
        models:["Polaris iCleaner","Polaris AW20","Polaris AW40","Polaris Alpha IQ+","Polaris 9550 Sport","Polaris 9450 Sport","Polaris 9350"],
        note:"Polaris i-series and AW-series robots connect via the iAquaLink or Polaris app. LED indicators on the robot body plus in-app status messages are the primary diagnostic interface.",
        codes:[
          { code:"App: Not connecting", name:"Wi-Fi Setup or App Reset Needed",
            causes:["Wi-Fi network SSID or password changed since initial setup","Robot is paired to old network","App needs update","2.4 GHz Wi-Fi not available (robot requires 2.4 GHz, not 5 GHz)","Router firmware blocking mDNS or local device discovery"],
            fix:["Open Polaris/iAquaLink app and navigate to Settings > Devices > Remove Device","Re-add robot using in-app setup wizard","Ensure your phone is on 2.4 GHz Wi-Fi during setup (temporarily disable 5 GHz if dual-band)","Update app to latest version from App Store or Google Play","Reset robot Wi-Fi by holding the power button for 10 seconds until LED blinks rapidly"],
            severity:"low", callpro:false },
          { code:"App: Filter indicator", name:"Filter Canister Full — Clean Required",
            causes:["Debris collection canister has reached capacity","Heavy debris load (leaves, algae, fine sediment)","Filter screen clogged reducing suction flow"],
            fix:["Remove robot from pool","Open filter canister door (rear of robot)","Remove and empty filter canister — dispose of debris","Rinse filter screen/cartridge under garden hose until clear","Reinstall filter and restart cleaning cycle"],
            severity:"low", callpro:false },
          { code:"LED: Solid Red (AW20/AW40)", name:"Drive or Motor Fault",
            causes:["Drive motor stalled or overheated","Impeller blocked by debris","Robot trapped or drive wheel jammed"],
            fix:["Remove robot from pool","Clear all debris from impeller, brushes, and drive wheels","Let robot cool 15 minutes if it has been running for extended period","Unplug power supply for 60 seconds to perform full reset","If solid red persists after reset and cleaning: contact Polaris/Zodiac support"],
            severity:"high", callpro:true },
          { code:"LED: Blinking Red (AW20/AW40)", name:"Cable Tangle or Overcurrent Warning",
            causes:["Power cable tangled or kinked around robot body","Motor drawing excess current from obstacle or debris jam","Power supply issue"],
            fix:["Remove robot and untangle cable — lay cable out straight before restarting","Check impeller and brushes for debris","Ensure power cable has enough slack to follow robot through full pool coverage","Use cable swivel if cable tangling is chronic"],
            severity:"medium", callpro:false },
          { code:"LED: Solid Blue (AW20/AW40)", name:"Normal Operation",
            causes:["Robot is running normally"],
            fix:["No action needed"],
            severity:"low", callpro:false },
          { code:"LED: Blinking Blue (AW20/AW40)", name:"Cycle Complete",
            causes:["Cleaning cycle finished normally"],
            fix:["Remove robot from pool","Empty and rinse filter canister","Rinse robot exterior","Store out of direct sunlight when not in use"],
            severity:"low", callpro:false },
          { code:"No LED / Won't start (i-series)", name:"No Power — Supply or GFCI Fault",
            causes:["GFCI outlet tripped","Power supply unit failed","Cable damaged at plug or swivel","Transformer output out of spec"],
            fix:["Press reset button on GFCI outlet — test outlet with another device","Inspect cable for cuts, kinks, or damage at both ends","Check power supply output with multimeter if available","Try a known-good outlet on a different circuit","If power supply confirmed faulty: Polaris OEM power supply replacement required"],
            severity:"high", callpro:false }
        ]
      }
    }
  }
};

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
  }
};

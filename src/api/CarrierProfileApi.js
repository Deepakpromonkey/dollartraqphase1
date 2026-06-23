const CarrierProfileApi = {
	getCarrierProfile: function () {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve({
					company_name: "MIL-SPEC INC",
					legal_name: "DBA: STAUFFER TRUCKING",
					status: "Active",
					base_operation: "Indianapolis, IN",
					years_active: "12 Years",
					mc_number: "231234",
					dot_number: "2398368",
					ein: "273119132",
					duns: "231234",
					headquarters: "129 Industrial Way Chicago, IL 60609",
					phone: "(555) 124-9002",
					email: "ops@milspecinc.com",
					website: "www.milspecinc.com",

					safety: {
						// Summary Stats
						rating: "Satisfactory",
						rating_label: "SATISFACTORY",
						vehicle_oos: "14.2%",
						vehicle_oos_label: "VS NATL AVG 21%",
						crash_rate: "0.82",
						crash_rate_label: "LTM BASIS",
						active_alerts: "04",
						active_alerts_label: "Active Alerts",

						overview: {
							issIndex: 20,
							riskLevel: "LOW RISK",
							status: "OPERATIONAL PASS",
							safetyRating: "Satisfactory",
							vehicleOos: "14.2%",
							crashRate: "0.82",
							activeAlerts: "04",
							verifications: [
								{
									label: "ELD Status Verification",
									isPass: true,
								},
								{
									label: "CDL Document Integrity",
									isPass: true,
								},
								{
									label: "Vehicle Maintenance Logs",
									isPass: false,
								},
								{
									label: "Safety Audit Compliance",
									isPass: false,
								},
								{
									label: "Drug & Alcohol Clearinghouse",
									isPass: false,
								},
							],
							criticalFlags: [
								{
									message:
										"Vehicle Maintenance at 86% exceeds the safety threshold of 80%",
								},
								{
									message:
										"Vehicle Out-of-Service (OOS) rate 23.1% is trending above the national average (22.3%)",
								},
							],
							basicsTable: {
								percentile: {
									unsafeDriving: "24%",
									crashIndicator: "13%",
									hosCompliance: "54%",
									vehicleMaint: "86%",
									controlledSubstances: "--",
									driverFitness: "--",
									hazmat: "--",
								},
								threshold: {
									unsafeDriving: "65%",
									crashIndicator: "65%",
									hosCompliance: "65%",
									vehicleMaint: "80%",
									controlledSubstances: "80%",
									driverFitness: "80%",
									hazmat: "80%",
								},
								violations: {
									unsafeDriving: "50",
									crashIndicator: "--",
									hosCompliance: "24",
									vehicleMaint: "145",
									controlledSubstances: "--",
									driverFitness: "--",
									hazmat: "--",
								},
								severeViolations: {
									unsafeDriving: "18",
									crashIndicator: "--",
									hosCompliance: "8",
									vehicleMaint: "32",
									controlledSubstances: "--",
									driverFitness: "--",
									hazmat: "--",
								},
								oosViolations: {
									unsafeDriving: "--",
									crashIndicator: "--",
									hosCompliance: "--",
									vehicleMaint: "35",
									controlledSubstances: "--",
									driverFitness: "--",
									hazmat: "--",
								},
								measures: {
									unsafeDriving: "1.6",
									crashIndicator: "0.2",
									hosCompliance: "0.3",
									vehicleMaint: "5.9",
									controlledSubstances: "--",
									driverFitness: "--",
									hazmat: "--",
								},
							},
							inspections: {
								vehicleInspections: "120",
								driverInspections: "225",
								hazmatInspections: "0",
								vehicleOos: "27",
								driverOos: "1",
								hazmatOos: "0",
								vehicleOosRate: "22.5%",
								driverOosRate: "0.4%",
								hazmatOosRate: "0.0%",
								nationalAvgVehicle: "22.3%",
								nationalAvgDriver: "6.7%",
								nationalAvgHazmat: "4.4%",
								safetyRating: "Satisfactory",
								lastInspection: "04/28/2026",
							},
							crashes: {
								fatal: "0",
								injury: "3",
								tow: "11",
								total: "14",
								lastCrashDate: "02/25/2026",
							},
						},

						// Data for the RISK FACTORS tab
						riskFactors: {
							issIndex: 65,
							riskLevel: "MEDIUM RISK",
							status: "UNDER REVIEW",
							safetyRating: "Conditional",
							vehicleOos: "22.5%",
							crashRate: "1.45",
							activeAlerts: "12",
							verifications: [
								{
									label: "Severe Safety Violations",
									isPass: false,
								},
								{
									label: "Moving Violation Frequency",
									isPass: false,
								},
								{
									label: "Driver Turn-over Rate",
									isPass: true,
								},
								{
									label: "HOS Compliance Record",
									isPass: false,
								},
							],
							criticalFlags: [
								{
									message:
										"59 severe safety violations reported in the last 24 months",
								},
								{
									message:
										"OOS% above industry average threshold",
								},
							],
						},
						// Inside your safety object in CarrierProfileApi.js
						basics: {
							basics_data: {
								unsafeDriving: { val: "24%", trend: "↑ 2%" },
								crashIndicator: { val: "13%", trend: "↓ 1%" },
								hosCompliance: { val: "54%", trend: "↑ 8%" },
								vehicleMaint: { val: "82%", trend: "↑ 12%" },
								controlledSubstances: {
									val: "0%",
									trend: "--",
								},
								driverFitness: { val: "15%", trend: "↓ 3%" },
								hazmat: { val: "9%", trend: "↓ 2%" },
							},
							criticalWarning:
								"14 vehicles are currently above the 80% intervention threshold.",
							// Chart data (raw numbers only)
							trendData: [
								{
									month: "Nov",
									unsafe: 20,
									maint: 40,
									crash: 45,
								},
								{
									month: "Dec",
									unsafe: 25,
									maint: 38,
									crash: 42,
								},
								{
									month: "Jan",
									unsafe: 22,
									maint: 42,
									crash: 40,
								},
								{
									month: "Feb",
									unsafe: 30,
									maint: 50,
									crash: 38,
								},
								{
									month: "Mar",
									unsafe: 45,
									maint: 60,
									crash: 35,
								},
								{
									month: "Apr",
									unsafe: 52,
									maint: 65,
									crash: 42,
								},
								{
									month: "May",
									unsafe: 40,
									maint: 62,
									crash: 48,
								},
								{
									month: "Jun",
									unsafe: 35,
									maint: 55,
									crash: 50,
								},
								{
									month: "Jul",
									unsafe: 58,
									maint: 60,
									crash: 45,
								},
								{
									month: "Aug",
									unsafe: 65,
									maint: 58,
									crash: 42,
								},
								{
									month: "Sep",
									unsafe: 82,
									maint: 62,
									crash: 40,
								},
								{
									month: "Oct",
									unsafe: 75,
									maint: 60,
									crash: 38,
								},
							],
							dropdownOptions: [
								{ label: "Last 3 Months", value: "3" },
								{ label: "Last 6 Months", value: "6" },
								{ label: "Last 12 Months", value: "12" },
							],
							// Expanded list for "View All" testing
							recentViolations: [
								{
									id: 1,
									type: "UNSAFE DRIVING",
									title: "Speeding 6-10 mph over limit",
									date: "Oct 24",
									vehicle: "TRK-8821",
									severity: 7,
								},
								{
									id: 2,
									type: "HOS COMPL.",
									title: "Log violation (General/Form)",
									date: "Oct 21",
									vehicle: "TRK-9004",
									severity: 4,
								},
								{
									id: 3,
									type: "VEHICLE MAINT.",
									title: "Inoperative/defective brakes",
									date: "Oct 19",
									vehicle: "TRK-7712",
									severity: 10,
								},
								{
									id: 4,
									type: "DRIVER FITNESS",
									title: "Expired Medical Certificate",
									date: "Oct 15",
									vehicle: "TRK-1122",
									severity: 2,
								},
								{
									id: 5,
									type: "HAZMAT",
									title: "Leaking package not reported",
									date: "Oct 12",
									vehicle: "TRK-4455",
									severity: 8,
								},
								{
									id: 6,
									type: "UNSAFE DRIVING",
									title: "Failure to yield right of way",
									date: "Oct 10",
									vehicle: "TRK-9900",
									severity: 5,
								},
							],
							comprehensiveLog: [
								{
									date: "Oct 24, 2023",
									category: "UNSAFE DRIVING",
									subgroup: "Speeding",
									description: "Speeding 6-10 mph over limit",
									severity: 7,
									oos: false,
								},
								{
									date: "Oct 21, 2023",
									category: "HOS COMPL.",
									subgroup: "Form & Manner",
									description: "Log violation (General/Form)",
									severity: 4,
									oos: false,
								},
								{
									date: "Oct 19, 2023",
									category: "VEHICLE MAINT.",
									subgroup: "Brakes",
									description: "Inoperative/defective brakes",
									severity: 10,
									oos: true,
								},
								{
									date: "Oct 15, 2023",
									category: "DRIVER FITNESS",
									subgroup: "Medical",
									description: "Expired Medical Certificate",
									severity: 2,
									oos: false,
								},
							],
						},
						inspectionAnalysis: {
							summaryCards: [
								{
									id: 1,
									title: "TOP PERFORMER",
									value: "50.0%",
									subtitle: "CLEAN INSPECTION RATE",
									footer: "56 of 112 inspections",
									type: "clean",
									trend: null,
								},
								{
									id: 2,
									title: "AT RISK",
									value: "23.1%",
									subtitle: "VEHICLE OOS RATE",
									footer: "vs 22.3% baseline",
									trend: "+0.8%",
									type: "risk",
								},
								{
									id: 3,
									title: "STABLE",
									value: "0.4%",
									subtitle: "DRIVER OOS RATE",
									footer: "efficiency gain",
									trend: "-6.3%",
									type: "stable",
								},
								{
									id: 4,
									title: "LAST INSPECTION",
									value: "20 Days",
									subtitle: "DAYS SINCE LAST CHECK",
									footer: "Oct 04, 2023 • District 4",
									type: "neutral",
								},
							],

							dropdownOptions: [
								{ label: "All Levels", value: "all" },
								{ label: "Clean", value: "clean" },
								{ label: "Risk", value: "risk" },
								{ label: "Out Of Service", value: "oos" },
							],

							chartData: [
								{
									month: "JAN",
									clean: 32,
									violations: 18,
									oos: 8,
								},
								{
									month: "FEB",
									clean: 40,
									violations: 22,
									oos: 12,
								},
								{
									month: "MAR",
									clean: 46,
									violations: 20,
									oos: 10,
								},
								{
									month: "APR",
									clean: 38,
									violations: 18,
									oos: 8,
								},
								{
									month: "MAY",
									clean: 50,
									violations: 25,
									oos: 15,
								},
								{
									month: "JUN",
									clean: 48,
									violations: 20,
									oos: 10,
								},
								{
									month: "JUL",
									clean: 45,
									violations: 22,
									oos: 12,
								},
								{
									month: "AUG",
									clean: 42,
									violations: 18,
									oos: 8,
								},
								{
									month: "SEP",
									clean: 47,
									violations: 20,
									oos: 10,
								},
								{
									month: "OCT",
									clean: 50,
									violations: 22,
									oos: 15,
								},
								{
									month: "NOV",
									clean: 48,
									violations: 20,
									oos: 12,
								},
								{
									month: "DEC",
									clean: 49,
									violations: 21,
									oos: 12,
								},
							],

							tableData: [
								{
									date: "Oct 24, 2023",
									region: "Ohio District (OH)",
									type: "Level I Inspection",
									refId: "OH14798904",
									status: "clean",
								},
								{
									date: "Oct 22, 2023",
									region: "Texas HUB (TX)",
									type: "Level II Inspection",
									refId: "TX99652867",
									status: "violation",
								},
								{
									date: "Oct 18, 2023",
									region: "Indiana Main (IN)",
									type: "Level III Inspection",
									refId: "IN64528646",
									status: "oos",
								},
								{
									date: "Oct 15, 2023",
									region: "Illinois North",
									type: "Level I Inspection",
									refId: "IL74256811",
									status: "clean",
								},
								{
									date: "Oct 15, 2023",
									region: "Illinois North",
									type: "Level I Inspection",
									refId: "IL74256811",
									status: "clean",
								},
								{
									date: "Oct 15, 2023",
									region: "Illinois North",
									type: "Level I Inspection",
									refId: "IL74256811",
									status: "clean",
								},
							],
						},
						// Inside CarrierProfileApi.js -> safety object
						crashesAnalysis: {
							summaryCards: [
								{
									id: 1,
									title: "CRASH RATE",
									value: "0.53",
									footer: "PEER AVERAGE",
									footerValue: "0.72",
									type: "stable",
									badge: "↓ 25%",
								},
								{
									id: 2,
									title: "DAYS SINCE LAST CRASH",
									value: "62",
									subtitle: "DAYS",
									footer: "TARGET: 100+",
									footerValue: "38 DAYS TO GOAL",
									type: "neutral",
									badge: "STABLE",
								},
								{
									id: 3,
									title: "SEVERE CRASH RATIO",
									value: "0.0%",
									footer: "ZERO INCIDENTS",
									footerValue: "SAFE",
									type: "clean",
									badge: "LOW",
								},
								{
									id: 4,
									title: "FLEET SAFETY INDEX",
									value: "94.8",

									footer: "TOP PERFORMER",
									footerValue: "+2.4",
									type: "risk",
									badge: "+2.4",
								},
							],

							chartTabs: {
								"12M": [
									{ month: "OCT", count: 3, rate: 0.35 },
									{ month: "NOV", count: 4.5, rate: 0.36 },
									{ month: "DEC", count: 2, rate: 0.37 },
									{ month: "JAN", count: 6.1, rate: 0.45 },
									{ month: "FEB", count: 4.2, rate: 0.64 },
									{ month: "MAR", count: 5.6, rate: 0.82 },
									{ month: "APR", count: 3.5, rate: 0.88 },
									{ month: "MAY", count: 7.7, rate: 0.9 },
									{ month: "JUN", count: 5.1, rate: 0.87 },
									{ month: "JUL", count: 9.2, rate: 0.8 },
									{ month: "AUG", count: 6.7, rate: 0.79 },
									{ month: "SEP", count: 4.8, rate: 0.82 },
								],

								YTD: [
									{ month: "JAN", count: 4, rate: 0.48 },
									{ month: "FEB", count: 5, rate: 0.62 },
									{ month: "MAR", count: 6, rate: 0.76 },
									{ month: "APR", count: 4, rate: 0.8 },
									{ month: "MAY", count: 7, rate: 0.83 },
									{ month: "JUN", count: 6, rate: 0.78 },
									{ month: "JUL", count: 8, rate: 0.74 },
								],

								ALL: [
									{ month: "2021", count: 9, rate: 0.92 },
									{ month: "2022", count: 7, rate: 0.71 },
									{ month: "2023", count: 5, rate: 0.55 },
									{ month: "2024", count: 3, rate: 0.41 },
								],
							},

							tableData: [
								{
									date: "Oct 24, 2023",
									region: "Dallas, TX",
									severity: "TOW-AWAY",
									refId: "DOT-882190",
									hazmat: false,
									description:
										"Collision with another vehicle at intersection",
								},
								{
									date: "Oct 12, 2023",
									region: "Nashville, TN",
									severity: "INJURY",
									refId: "DOT-441233",
									hazmat: true,
									description:
										"Jackknife incident due to hydroplaning",
								},
								{
									date: "Sep 28, 2023",
									region: "Columbus, OH",
									severity: "OTHER",
									refId: "DOT-110092",
									hazmat: false,
									description:
										"Minor side-swipe with stationary object",
								},
								{
									date: "Aug 14, 2023",
									region: "Atlanta, GA",
									severity: "FATAL",
									refId: "DOT-992231",
									hazmat: true,
									description:
										"Multi-vehicle crash during severe weather",
								},
							],
						},
					},

					insurance: {
						bipd: "$250,000",
						cargo: "$1,000,000",
					},
					fleet: {
						power_units: 142,
						drivers: 168,
						trailers: 250,

						equipment: [
							{
								type: "Observed Units",
								quantity: "98",
								status: "Tracked",
								statusVariant: "success",
							},
							{
								type: "Observed Trailers",
								quantity: "126",
								status: "Tracked",
								statusVariant: "success",
							},
							{
								type: "Mileage",
								quantity: "9,380,000 mi",
								status: "2026",
								statusVariant: "neutral",
							},
						],

						topCards: [
							{
								id: 1,
								title: "PRESERVED IN LAST 120 DAYS",
								value: "25%",
								subtitle: "Power 24% • Trailer 26%",
								type: "blue",
							},
							{
								id: 2,
								title: "AVG POWER AGE",
								value: "13.2",
								unit: "Years",
								type: "orange",
							},
							{
								id: 3,
								title: "AVG TRAILER AGE",
								value: "11.5",
								unit: "Years",
								type: "purple",
							},
							{
								id: 4,
								title: "POWER CLASS 8",
								value: "100%",
								subtitle: "of power units",
								type: "dark",
							},
							{
								id: 5,
								title: "TRAILER MIX",
								value: "69%",
								subtitle: "Flatbed",
								type: "green",
							},
						],

						sortOptions: [
							{ label: "Last Seen", value: "last_seen" },
							{ label: "Newest", value: "newest" },
							{ label: "Oldest", value: "oldest" },
						],

						powerTabs: [
							{
								label: "Truck Tractor",
								value: "truck_tractor",
								count: 118,
							},
							{
								label: "Chassis Cab",
								value: "chassis_cab",
								count: 11,
							},
							{
								label: "Unclassified",
								value: "unclassified_power",
								count: 1,
							},
						],

						trailerTabs: [
							{ label: "Flatbed", value: "flatbed", count: 62 },
							{
								label: "Unclassified",
								value: "unclassified_trailer",
								count: 34,
							},
							{ label: "Dry Van", value: "dry_van", count: 6 },
							{
								label: "Specialty",
								value: "specialty",
								count: 1,
							},
						],

						tableData: [
							{
								type: "Power",
								vin: "1FUJCRCK79AD7718",
								plate: "GA C854DZ",
								class: "Class 8",
								desc: "Truck Tractor",
								year: "2009",
								make: "Freightliner",
								model: "Coronado",
								lastSeen: "4/28/2026",
								category: "truck_tractor",
							},

							{
								type: "Trailer",
								vin: "1RNF4BA27KR051679",
								plate: "ME 3114706",
								class: "Flatbed",
								desc: "Conestoga",
								year: "2019",
								make: "Reitnouer Inc",
								model: "-",
								lastSeen: "4/28/2026",
								category: "flatbed",
							},

							{
								type: "Trailer",
								vin: "3ALYFB003JJDJX0097",
								plate: "NC VV1920",
								class: "Unclassified",
								desc: "—",
								year: "2018",
								make: "Freightliner",
								model: "Coronado",
								lastSeen: "4/24/2026",
								category: "unclassified_trailer",
							},

							{
								type: "Trailer",
								vin: "1UYVS2531FP621914",
								plate: "SC 27119PT",
								class: "Dry Van",
								desc: "Standard Dry Van",
								year: "2015",
								make: "Utility Trailer Manufacturer",
								model: "-",
								lastSeen: "4/24/2026",
								category: "dry_van",
							},

							{
								type: "Power",
								vin: "1XPBD49X5FD345747",
								plate: "SC FP64172",
								class: "Class 8",
								desc: "Truck Tractor",
								year: "2015",
								make: "Peterbilt",
								model: "579",
								lastSeen: "4/20/2026",
								category: "truck_tractor",
							},
						],
					},

					loadHistory: {
						summaryCards: [
							{
								id: 1,
								title: "Strong sample",
								value: "162",
								subtitle: "total loads processed",
								footerLabel: "Confidence Score",
								footerValue: "94%",
								progress: 94,
							},
							{
								id: 2,
								title: "FULL TRUCKLOAD",
								value: "100%",
								subtitle: "+~2.1% improvement",
							},
							{
								id: 3,
								title: "LESS THAN TRUCKLOAD",
								value: "0%",
								subtitle: "No secondary utilization",
							},
							{
								id: 4,
								title: "DEADHEAD",
								value: "3%",
								subtitle: "Optimizable waste margin",
							},
						],
						insights: [
							{
								id: 1,
								title: "Top Shipper concentrations for individual lanes range from 2.5% to 6.3%",
							},
							{
								id: 2,
								title: "The Top 5 shippers represent 19% of total volume, while the Top 10 shippers account for 34%",
							},
							{
								id: 3,
								title: "Outbound from T-AL-1 is the highest volume lane, representing 6% of the overall freight mix.",
							},
						],
						concentration: {
							total: "19%",
							label: "TOTAL TOP 4",
							items: [
								{ name: "Shipper A", value: "6.3%" },
								{ name: "Shipper B", value: "4.2%" },
								{ name: "Shipper C", value: "3.5%" },
								{ name: "Shipper D", value: "2.5%" },
							],
						},
						tableData: [
							{
								id: 1,
								shipper: "TechGlobal Systems",
								totalVolume: "2,450",
								onTime: 98,
								revenue: "$1.2M",
								status: "ACTIVE",
							},
							{
								id: 2,
								shipper: "NexusLTD Logistics",
								totalVolume: "1,890",
								onTime: 92,
								revenue: "$840K",
								status: "ACTIVE",
							},
							{
								id: 3,
								shipper: "PrimeLog Solutions",
								totalVolume: "1,420",
								onTime: 85,
								revenue: "$610K",
								status: "DELAYED",
							},
							{
								id: 4,
								shipper: "OrbitSupply Corp",
								totalVolume: "1,210",
								onTime: 95,
								revenue: "$520K",
								status: "ACTIVE",
							},
							{
								id: 5,
								shipper: "Nova Freight Systems",
								totalVolume: "980",
								onTime: 90,
								revenue: "$430K",
								status: "ACTIVE",
							},
							{
								id: 6,
								shipper: "Apex Transport Group",
								totalVolume: "860",
								onTime: 81,
								revenue: "$390K",
								status: "DELAYED",
							},
							{
								id: 7,
								shipper: "BlueWave Freight",
								totalVolume: "730",
								onTime: 96,
								revenue: "$350K",
								status: "ACTIVE",
							},
							{
								id: 8,
								shipper: "MetroLine Carriers",
								totalVolume: "610",
								onTime: 89,
								revenue: "$270K",
								status: "ACTIVE",
							},
						],
						menuOptions: [
							{ label: "View Details", value: "view" },
							{ label: "Export Data", value: "export" },
							{ label: "Refresh", value: "refresh" },
						],
					},
					companySnapshot: {
						authorityStatus: {
							status: "ACTIVE",
							commonMonths: 517,
							contractMonths: 488,
							brokerMonths: 373,
							operation: "Interstate",
							flags: {
								property: true,
								passenger: false,
								household: false,
								hazmat: false,
							},
						},

						authorityHistory: [
							{
								id: 1,
								authorityType: "BROKER",
								action: "REINSTATEMENT",
								disposition: "GRANTED",
								statusDate: "02/14/1995",
							},
							{
								id: 2,
								authorityType: "CARRIER",
								action: "APPLICATION",
								disposition: "GRANTED",
								statusDate: "11/20/1985",
							},
							{
								id: 3,
								authorityType: "BROKER",
								action: "DISCONTINUANCE",
								disposition: "DISMISSED",
								statusDate: "01/10/1995",
							},
							{
								id: 3,
								authorityType: "BROKER",
								action: "DISCONTINUANCE",
								disposition: "DISMISSED",
								statusDate: "01/10/1995",
							},
							{
								id: 3,
								authorityType: "BROKER",
								action: "DISCONTINUANCE",
								disposition: "DISMISSED",
								statusDate: "01/10/1995",
							},
						],

						operationClassification: {
							options: [
								{
									label: "Auth. For Hire",
									value: "auth_for_hire",
									selected: true,
								},
								{
									label: "Exempt For Hire",
									value: "exempt_for_hire",
									selected: false,
								},
								{
									label: "Private Property",
									value: "private_property",
									selected: false,
								},
								{
									label: "Priv. Pass. (B)",
									value: "priv_pass_b",
									selected: false,
								},
								{
									label: "Priv. Pass. (N)",
									value: "priv_pass_n",
									selected: false,
								},
								{
									label: "Migrant",
									value: "migrant",
									selected: false,
								},
							],
						},

						cargoCarried: {
							options: [
								{ label: "Gen Freight", selected: true },
								{ label: "Bldg Mat", selected: true },
								{ label: "Machinery", selected: true },
								{ label: "Fresh Prod", selected: true },
								{ label: "Livestock", selected: true },
								{ label: "Grain Feed", selected: true },
								{ label: "Coal", selected: false },
								{ label: "Liquids", selected: false },
							],
						},

						insurance: {
							status: "VALIDATED",
							bipdCoverage: "$750,000",
							cargoInsurance: "$0",
							bondTrust: "$75,000",
							policies: [
								{
									id: 1,
									carrier: "Great West Casualty Co.",
									policyNo: "GWC74129A",
									type: "BIPD",
									coverage: "$750,000",
									effectiveDate: "01/01/2026",
								},
								{
									id: 2,
									carrier: "Nationwide Mutual Ins.",
									policyNo: "NW-8892-00",
									type: "BOND",
									coverage: "$75,000",
									effectiveDate: "05/15/2025",
								},
							],
						},
					},
					lanes: [
						{
							id: "01",
							route: "Chicago, IL → Atlanta, GA",
							percentage: 85,
						},
						{
							id: "02",
							route: "Indy, IN → Dallas, TX",
							percentage: 62,
						},
						{
							id: "03",
							route: "Columbus, OH → Nashville, TN",
							percentage: 44,
						},
						{
							id: "04",
							route: "Columbus, OH → Nashville, TN",
							percentage: 44,
						},
						{
							id: "05",
							route: "Columbus, OH → Nashville, TN",
							percentage: 44,
						},
						{
							id: "06",
							route: "Columbus, OH → Nashville, TN",
							percentage: 44,
						},
					],
					companyAssociations: [
						{
							company_name: "AL ZEFFIRO TRANSFER & STORAGE INC",
							annual_mileage: "1,452,000",
							fleet_size: "42",
							mc_number: "492015",
							dot_number: "1294857",
							duns_number: "15-492-0032",

							authority: true,
							insurance: true,
							high_risk: true,

							associations: [
								{
									type: "address",
									label: "Shared Address",
									value: "104 Industrial Way, Suite A",
									period: "2021 — PRESENT",
								},
								{
									type: "phone",
									label: "Contact Number",
									value: "(412) 555-0192",
									period: "2019 — PRESENT",
								},
								{
									type: "email",
									label: "Email Address",
									value: "dispatch@alzeffiro.com",
									period: "2020 — PRESENT",
								},
							],
						},

						{
							company_name: "MIDWEST FREIGHT GROUP",
							annual_mileage: "985,000",
							fleet_size: "31",
							mc_number: "781245",
							dot_number: "4485129",
							duns_number: "22-193-8821",

							authority: true,
							insurance: false,
							high_risk: true,

							associations: [
								{
									type: "address",
									label: "Shared Address",
									value: "990 Logistics Pkwy, Dallas TX",
									period: "2020 — PRESENT",
								},
								{
									type: "phone",
									label: "Contact Number",
									value: "(972) 552-9921",
									period: "2018 — PRESENT",
								},
							],
						},

						{
							company_name: "NOVA TRANS EXPRESS",
							annual_mileage: "2,100,000",
							fleet_size: "58",
							mc_number: "991281",
							dot_number: "7822145",
							duns_number: "09-882-1002",

							authority: false,
							insurance: false,
							high_risk: false,

							associations: [],
						},
					],
					    equipmentInsights: {


    broker_interstate_carrier: true,

    companies: [
        {

            companyType: "BROKER, INTERSTATE CARRIER",

            isBroker: true,

            companyName: "THE KAPLAN TRUCKING COMPANY",

            dotNumber: "120670",

            mcNumber: "MC2304",



            powerUnits: {

                avgAge: 13,

                reported: 250,

                observed: 121,

                extObs: 26,

                observedOtherFleets: "21"

            },



            trailers: {

                avgAge: 12,

                reported: 250,

                observed: 124,

                extObs: 17,

                observedOtherFleets: "14"

            },



            records: [

                {

                    type: "power",

                    vin: "1XPX0549X4D...",

                    plate: "AP77978",

                    class: "8",

                    description: "Truck-Tractor",

                    year: "2014",

                    make: "Peterbilt",

                    model: "386",

                    lastSeen: "Aug 15, 2023"

                },

                {

                    type: "power",

                    vin: "1XPD548X9ED...",

                    plate: "BC11234",

                    class: "8",

                    description: "Truck-Tractor",

                    year: "2016",

                    make: "Freightliner",

                    model: "Cascadia",

                    lastSeen: "Aug 12, 2023"

                },

                {

                    type: "trailer",

                    vin: "1UJ1234X0AB...",

                    plate: "TL9901",

                    class: "—",

                    description: "Van-Trailer",

                    year: "2020",

                    make: "Wabash",

                    model: "Duraplate",

                    lastSeen: "Aug 10, 2023"

                },

                {

                    type: "power",

                    vin: "1FUJH567X0B...",

                    plate: "ZX0091",

                    class: "8",

                    description: "Truck-Tractor",

                    year: "2018",

                    make: "Kenworth",

                    model: "T680",

                    lastSeen: "Aug 09, 2023"

                },

                {

                    type: "power",

                    vin: "1XP99999ABC...",

                    plate: "TX8821",

                    class: "8",

                    description: "Truck-Tractor",

                    year: "2019",

                    make: "Peterbilt",

                    model: "579",

                    lastSeen: "Aug 05, 2023"

                },

                {

                    type: "trailer",

                    vin: "1UY7788XYZ...",

                    plate: "TR2201",

                    class: "—",

                    description: "Flatbed",

                    year: "2021",

                    make: "Hyundai",

                    model: "Flatbed",

                    lastSeen: "Aug 01, 2023"

                }

            ]

        }

    ]

},
industryBenchmarks: {
    fleetCompliance: {
    status: "Within normal range",
    alert: "Exceeds predicted average"
  },
  inspectionCount: {
    observed: 224,
    lowerThreshold: 43,
    upperLimit: 260,
    benchmark: 180
  },
  powerUnitsReported: {
    value: 250,
    minObserved: 46,
    maxObserved: 195,
    benchmark: 160
  },
  powerUnitsObserved: {
    value: 121,
    avgMin: 50,
    avgMax: 140,
    benchmark: 60,
	deviation: "110"
  }
},
contactHistory: {
  summary: {
    name: { count: 0,  status: "Update", lastUpdated: "03/12/2021" },
    email: { count: 1,  status: "Update", lastUpdated: "03/12/2021" },
    phone: { count: 0,  status: "Active", lastUpdated: "03/12/2021" },
    address: { count: 1,  status: "Update", lastUpdated: "03/12/2021" },
    contact: { count: 3,  status: "Update", lastUpdated: "03/12/2021" }
  },

  addresses: [
    {
      type: "PHYSICAL RESIDENCE",
      address: "1800 OLD LINCOLN HWY, LANGHORNE, PA 19047",
      period: "Jan 2019 – Jul 2022",
      modifiedBy: "System Administrator",
      status: "VERIFIED"
    },
    {
      type: "MAILING ADDRESS",
      address: "PO BOX 452, TRENTON, NJ 08601",
      period: "May 2015 – Dec 2018",
      modifiedBy: "Legacy Database Sync",
      status: "PRIOR"
    },
    {
      type: "Corporate Headquarters",
      address: "750 INNOVATION BLVD, PHILADELPHIA, PA 19104",
      period: "08/2022 – PRESENT",
      status: "PRIMARY"
    }
  ]
},
					reliability: {
						title: "RELIABILITY FACTORS",
						badge: "PREMIUM STANDING",
						items: [
							"517 consecutive months of active authority",
							"51 years active with FMCSA",
							"Inspected power units aligns with number reported",
							"Number of inspections aligns with reported mileage",
							"Stable equipment history",
							"Satisfactory safety rating as of 05/18/2000",
							"Secondary contact information provided",
							"MCS-150 recently filed on 04/22/2026",
							"SmartWay Certified",
							"Stable point of contact history",
							"Stable phone number history",
							"Stable company name history",
							"Stable email address history",
							"Stable insurance history",
						],
					},

					risks: {
						title: "RISK FACTORS",
						badge: "IMMEDIATE ATTENTION",
						items: [
							"Phone number shared with 2 other DOTs",
							"Address shared with 1 other DOTs",
							"59 severe safety violations reported in the last 24 months",
							"1 BASIC alerts detected in system",
							"OOS% above industry average threshold",
							"2 address changes with last change on 04/28/2026",
						],
					},
				});
			}, 500);
		});
	},

	getObservations: function (timeframe) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				const observationData = {
					"7D": {
						cln: 2,
						vio: 1,
						oos: 0,
						total: 3,
						cleanRate: "66%",
						tow: 0,
						inj: 0,
					},
					"3M": {
						cln: 14,
						vio: 5,
						oos: 1,
						total: 20,
						cleanRate: "70%",
						tow: 1,
						inj: 0,
					},
					"6M": {
						cln: 24,
						vio: 8,
						oos: 2,
						total: 34,
						cleanRate: "71%",
						tow: 3,
						inj: 1,
					},
					"1Y": {
						cln: 52,
						vio: 18,
						oos: 5,
						total: 75,
						cleanRate: "69%",
						tow: 7,
						inj: 3,
					},
				};

				const selected =
					observationData[timeframe] || observationData["6M"];

				resolve({
					inspections: {
						cln: selected.cln,
						vio: selected.vio,
						oos: selected.oos,
					},
					crash: { tow: selected.tow, inj: selected.inj },
					summary: {
						total: selected.total,
						cleanRate: selected.cleanRate,
						outOfSvc: selected.oos,
					},
				});
			}, 300);
		});
	},
};

export default CarrierProfileApi;

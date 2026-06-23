import React, { useState } from 'react';

import { HubOutlined, ShieldOutlined, InsertChartOutlined, IntegrationInstructionsOutlined, RocketLaunchOutlined, CheckOutlined, CheckCircleOutlined, DnsOutlined, GroupsOutlined, GppGoodOutlined, AddOutlined, RemoveOutlined } from '@mui/icons-material';

import Main from 'components/Main';

function Pricing(props) {

	const [activeSubTab, setActiveSubTab] = useState('platform');

	const [selectedPlan, setSelectedPlan] = useState(null);

	const [openFaqIndex, setOpenFaqIndex] = useState(0);

	const faqData = [
		{
			question: "What is included in the Pro plan?",
			answer: "The Pro plan is designed for solo brokers and includes real-time carrier monitoring for up to 50 active carriers, automated insurance expiration alerts, and a standard compliance history log."
		},
		{
			question: "How do you ensure data accuracy?",
			answer: "We maintain direct API integrations with the FMCSA, major insurance providers, and fraud detection networks. Our database refreshes every 15 minutes to eliminate stale data risks."
		},
		{
			question: "Can I integrate this into my existing TMS?",
			answer: "Absolutely. Our API Integration plan provides comprehensive RESTful endpoints. We also offer native plugins for McLeod, MercuryGate, and Tailwind TMS."
		},
		{
			question: "What kind of fraud detection do you provide?",
			answer: "We use behavioral analytics to identify double brokering patterns, address mismatches, and rapid authority transfers across our entire network."
		}
	];

	return (
		<Main active_page='pricing' page='pricing' full_width>

			<div className="w-full bg-[#0059BB00] font-sans antialiased text-[#111827] pb-[100px]">

				<div className="w-full mx-auto pt-[60px] pb-[40px] px-[24px] flex flex-col items-center text-center">

					<div className="inline-flex items-center gap-[8px] bg-[#0059BB1A] border border-[#E5E7EB] px-[14px] py-[5px] rounded-full shadow-sm mb-[32px]">

						<span className="h-[6px] w-[6px] rounded-full bg-[#1D4ED8]" />

						<span className="text-[12px] font-medium text-[#1E40AF]">
							New: Enterprise Risk Dashboard v2.0
						</span>

					</div>

					<h1 className="text-[44px] md:text-[54px] font-normal tracking-tight text-[#0F172A] max-w-[900px] leading-[1.15]">
						Sourcing, compliance, and <span className="text-[#1D4ED8]">risk management</span> — simplified.
					</h1>

					<p className="text-[15px] font-normal text-[#6B7280] max-w-[640px] mt-[24px] leading-[1.6]">
						The all-in-one logistics operating system for high-volume freight brokers and enterprise shippers looking to scale with confidence.
					</p>

					<div className="mt-[36px] inline-flex border border-[#D1D5DB] p-[4px] rounded-xl">

						<button
							onClick={() => {

								setActiveSubTab('platform');
							}}
							className={`px-[24px] py-[8px] text-[13px] font-medium rounded-lg transition-all duration-200 ${activeSubTab === 'platform' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#111827]'}`}
						>
							Platform Access
						</button>

						<button
							onClick={() => {

								setActiveSubTab('api');
							}}
							className={`px-[24px] py-[8px] text-[13px] font-medium rounded-lg transition-all duration-200 ${activeSubTab === 'api' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#111827]'}`}
						>
							API Integration
						</button>

						<button
							onClick={() => {

								setActiveSubTab('data');
							}}
							className={`px-[24px] py-[8px] text-[13px] font-medium rounded-lg transition-all duration-200 ${activeSubTab === 'data' ? 'bg-[#0052cc] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#111827]'}`}
						>
							Data Solutions
						</button>

					</div>
				</div>
				<div className="max-w-[1140px] mx-auto px-[24px] mt-[40px]">

					{activeSubTab === 'platform' && (

						<div className="space-y-[24px]">

							<div className="flex flex-col md:flex-row justify-between items-start pt-[20px] pb-[10px] gap-4">

								<div className="max-w-[450px]">

									<p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1D4ED8] mb-[8px]">
										Capabilities
									</p>

									<h2 className="text-[32px] font-normal tracking-tight text-[#111827] leading-[1.2]">
										Engineered for the Modern Network
									</h2>

								</div>
								<div className="max-w-[440px] md:pt-[24px]">

									<p className="text-[15px] text-[#4B5563] font-normal leading-[1.6]">
										Breaking down data silos with edge-computing and secure architectural foundations.
									</p>

								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-12 gap-[20px]">

								<div className="md:col-span-8 rounded-[24px] bg-white border border-[#E5E7EB] p-[36px] flex flex-col justify-between min-h-[260px] shadow-sm hover:shadow-md transition-shadow duration-300">

									<div>

										<div className="flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1D4ED8] mb-[28px]">
											<HubOutlined sx={{ fontSize: 22 }} />
										</div>

										<h3 className="text-[20px] font-medium text-[#111827] mb-[12px]">
											Edge Network Visualization
										</h3>

										<p className="text-[14px] text-[#4B5563] leading-[1.6] max-w-[600px]">
											Track assets across 120+ global nodes with sub-second latency. Our proprietary edge mesh ensures you never lose sight of a single parcel. Robust endpoints designed for seamless ERP and warehouse integration within minutes.
										</p>
										
									</div>

								</div>
								<div className="md:col-span-4 rounded-[24px] bg-[#001233] p-[32px] flex flex-col justify-between text-white min-h-[260px] shadow-sm transition-all duration-300 hover:bg-[#001845]">

									<div>

										<div className="flex h-[44px] w-[44px] items-center text-[#3B82F6] mb-[24px]">
											<ShieldOutlined sx={{ fontSize: 26 }} />
										</div>

										<h3 className="text-[19px] font-medium text-white mb-[12px]">
											Secured Sourcing
										</h3>

										<p className="text-[13.5px] text-[#93C5FD] leading-[1.5] opacity-90">
											Blockchain-verified vendor validation and automated compliance monitoring for every single touchpoint.
										</p>
									</div>

									<button
										onClick={() => {

											window.location.href = '/secured-sourcing';
										}}
										className="w-full h-[46px] rounded-full bg-white text-[#2563EB] text-[13px] font-semibold hover:bg-[#F3F4F6] transition-colors mt-[24px]"
									>
										Learn More
									</button>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">

								<div className="rounded-[24px] bg-white border border-[#E5E7EB] p-[28px] min-h-[160px] shadow-sm hover:shadow-md transition-shadow duration-300">

									<div className="flex text-[#1D4ED8] mb-[20px]">
										<InsertChartOutlined sx={{ fontSize: 22 }} />
									</div>

									<h4 className="text-[15px] font-semibold text-[#111827] mb-[8px]">
										Predictive Analytics
									</h4>

									<p className="text-[13px] text-[#4B5563] leading-[1.5]">
										AI models that forecast delays before they happen, suggesting reroutes in real-time.
									</p>

								</div>

								<div className="rounded-[24px] bg-white border border-[#E5E7EB] p-[28px] min-h-[160px] shadow-sm hover:shadow-md transition-shadow duration-300">

									<div className="flex text-[#1D4ED8] mb-[20px]">
										<IntegrationInstructionsOutlined sx={{ fontSize: 22 }} />
									</div>

									<h4 className="text-[15px] font-semibold text-[#111827] mb-[8px]">
										Developer API
									</h4>

									<p className="text-[13px] text-[#4B5563] leading-[1.5]">
										Robust endpoints designed for seamless ERP and warehouse integration within minutes.
									</p>

								</div>
								<div className="rounded-[24px] bg-white border border-[#E5E7EB] p-[28px] min-h-[160px] shadow-sm hover:shadow-md transition-shadow duration-300">

									<div className="flex text-[#1D4ED8] mb-[20px]">
										<RocketLaunchOutlined sx={{ fontSize: 22 }} />
									</div>

									<h4 className="text-[15px] font-semibold text-[#111827] mb-[8px]">
										Instant Fleet Sync
									</h4>

									<p className="text-[13px] text-[#4B5563] leading-[1.5]">
										Onboard new vehicles and drivers with a single QR code and automated credentialing.
									</p>

								</div>
							</div>
						</div>
					)}
					{activeSubTab !== 'platform' && (

						<div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-white p-[100px] flex flex-col items-center justify-center text-center">

							<h3 className="text-[17px] font-semibold text-[#1E293B]">No Data Found</h3>

							<p className="text-[13px] text-[#64748B] mt-[6px] max-w-[420px]">
								No deployment modules or dynamic data logs are connected to this option tab environment.
							</p>

						</div>
					)}
				</div>
			</div>
			<div className="w-full bg-[#000B21] relative overflow-hidden pt-[100px] pb-[100px] px-[24px] text-white">

				<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0044B3] rounded-full blur-[160px] opacity-20 pointer-events-none" />

				<div className="absolute bottom-[-15%] right-[-5%] w-[450px] h-[450px] bg-[#0033aa] rounded-full blur-[140px] opacity-15 pointer-events-none" />

				<div className="max-w-[1140px] mx-auto text-center flex flex-col items-center mb-[64px] relative z-10">

					<p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#3B82F6] mb-[16px]">
						Pricing
					</p>

					<h2 className="text-[40px] md:text-[48px] font-normal tracking-tight text-white leading-[1.2]">
						Scale with Precision
					</h2>

					<p className="text-[15px] font-normal text-[#94A3B8] max-w-[560px] mt-[18px] leading-[1.6]">
						Transparent models that evolve as you do. No hidden overhead, just absolute performance.
					</p>

				</div>
				<div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[28px] items-stretch relative z-10">

					<div className="rounded-[24px] bg-[#031333B3] border border-[#1E293B] p-[36px] flex flex-col justify-between transition-all duration-300 hover:border-[#334155] hover:translate-y-[-4px] hover:bg-[#041840E6]">

						<div>
							<p className="text-[11px] font-bold tracking-[0.15em] text-[#94A3B8] uppercase mb-[24px]">
								Start
							</p>

							<div className="flex items-baseline mb-[20px]">
								<span className="text-[48px] font-normal text-white tracking-tight">$499</span>
								<span className="text-[13px] text-[#64748B] ml-[4px]">/mo</span>
							</div>

							<p className="text-[13.5px] text-[#94A3B8] leading-[1.6] mb-[32px] min-h-[44px]">
								Perfect for growing regional logistics teams needing basic oversight.
							</p>

							<ul className="space-y-[16px] border-t border-[#1E293B] pt-[28px]">

								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<CheckOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>500 Active Assets</span>
								</li>

								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<CheckOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Standard Analytics</span>
								</li>

								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<CheckOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Email Support</span>
								</li>
							</ul>
						</div>

						<button
							onClick={() => {

								setSelectedPlan('start');
								window.location.href = '/checkout/start';
							}}
							className={`w-full h-[48px] rounded-full text-[13.5px] font-medium mt-[44px] transition-all duration-200 border ${selectedPlan === 'start' ? 'bg-[#1E293B] text-white border-[#3B82F6]' : 'bg-[#111E38] text-[#94A3B8] border-transparent hover:bg-[#1C2C4E] hover:text-white'}`}
						>
							{selectedPlan === 'start' ? 'Selected' : 'Choose Basic'}
						</button>
					</div>

					<div className="rounded-[24px] bg-[#001D6680] border-2 border-[#0052CC] p-[36px] flex flex-col justify-between relative transition-all duration-300 hover:translate-y-[-4px] hover:bg-[#002277A6] shadow-[0_0_40px_rgba(0,82,204,0.15)]">
						<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0052CC] text-white text-[10px] font-bold uppercase tracking-[0.18em] px-[18px] py-[6px] rounded-full shadow-md whitespace-nowrap">
							Most Recommended
						</div>

						<div>
							<p className="text-[11px] font-bold tracking-[0.15em] text-[#93C5FD] uppercase mb-[24px] mt-[6px]">
								Growth
							</p>

							<div className="flex items-baseline mb-[20px]">
								<span className="text-[52px] font-normal text-white tracking-tight">$1,299</span>
								<span className="text-[13px] text-[#64748B] ml-[4px]">/mo</span>
							</div>

							<p className="text-[13.5px] text-[#93C5FD] opacity-90 leading-[1.6] mb-[32px] min-h-[44px]">
								For mid-to-large enterprises seeking absolute automated intelligence.
							</p>

							<ul className="space-y-[16px] border-t border-[#0033AA] pt-[28px]">

								<li className="flex items-center gap-[12px] text-[13.5px] text-white">
									<CheckCircleOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Unlimited Assets</span>
								</li>

								<li className="flex items-center gap-[12px] text-[13.5px] text-white">
									<CheckCircleOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Predictive AI Tools</span>
								</li>

								<li className="flex items-center gap-[12px] text-[13.5px] text-white">
									<CheckCircleOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>24/7 Priority Access</span>
								</li>

								<li className="flex items-center gap-[12px] text-[13.5px] text-white">
									<CheckCircleOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Custom API Hooks</span>
								</li>

							</ul>
						</div>
						<button
							onClick={() => {

								setSelectedPlan('growth');
								window.location.href = '/checkout/growth';
							}}
							className={`w-full h-[50px] rounded-full text-[13.5px] font-medium mt-[44px] shadow-lg transition-all duration-200 ${selectedPlan === 'growth' ? 'bg-white text-[#0052CC]' : 'bg-[#0052CC] text-white hover:bg-[#0066FF] hover:shadow-[0_4px_20px_rgba(0,82,204,0.4)]'}`}
						>
							{selectedPlan === 'growth' ? 'Selected' : 'Get Started Pro'}
						</button>
					</div>
					<div className="rounded-[24px] bg-[#031333B3] border border-[#1E293B] p-[36px] flex flex-col justify-between transition-all duration-300 hover:border-[#334155] hover:translate-y-[-4px] hover:bg-[#041840E6]">

						<div>

							<p className="text-[11px] font-bold tracking-[0.15em] text-[#94A3B8] uppercase mb-[24px]">
								Global
							</p>

							<div className="flex items-baseline mb-[20px]">
								<span className="text-[48px] font-normal text-white tracking-tight">Custom</span>
								<span className="text-[13px] text-[#64748B] ml-[6px]">/enterprise</span>
							</div>

							<p className="text-[13.5px] text-[#94A3B8] leading-[1.6] mb-[32px] min-h-[44px]">
								Full ecosystem integration and dedicated global infrastructure.
							</p>

							<ul className="space-y-[16px] border-t border-[#1E293B] pt-[28px]">
								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<DnsOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Dedicated Server Nodes</span>
								</li>
								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<GroupsOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>On-site Training</span>
								</li>
								<li className="flex items-center gap-[12px] text-[13.5px] text-[#E2E8F0]">
									<GppGoodOutlined className="text-[#3B82F6]" sx={{ fontSize: 16 }} />
									<span>Custom Security SLAs</span>
								</li>
							</ul>
						</div>
						<button
							onClick={() => {

								setSelectedPlan('global');
								window.location.href = '/contact-sales';
							}}
							className="w-full h-[48px] rounded-full text-[13.5px] font-medium bg-[#111E38] text-[#94A3B8] border border-transparent hover:border-[#475569] hover:bg-[#1C2C4E] hover:text-white mt-[44px] transition-all duration-200"
						>
							Contact Sales
						</button>
					</div>
				</div>
			</div>
			<div className="w-full bg-[#FAF9F5] pt-[80px] pb-[120px] px-[24px]">

				<div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-[60px]">

					<div className="md:col-span-4">
						<p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1D4ED8] mb-[12px]">
							Knowledge Base
						</p>

						<h2 className="text-[36px] font-normal tracking-tight text-[#111827] leading-[1.2]">
							Common Questions
						</h2>

						<p className="text-[14.5px] font-normal text-[#4B5563] mt-[16px] leading-[1.6]">
							Everything you need to know about the platform. Still curious? Our experts are just a chat away.
						</p>

					</div>
					<div className="md:col-span-8 space-y-[16px]">
						{faqData.map((faq, index) => {

							return (
								<div
									key={index}
									className="rounded-[24px] bg-white border border-[#E5E7EB] p-[28px] shadow-sm transition-all duration-300"
								>
									<button
										onClick={() => {

											setOpenFaqIndex(openFaqIndex === index ? null : index);
										}}
										className="w-full flex justify-between items-center text-left focus:outline-none"
									>
										<span className="text-[17px] font-medium text-[#111827] pr-[20px]">
											{faq.question}
										</span>
										<span className="text-[#0052cc] transition-transform duration-200 flex-shrink-0">
											{openFaqIndex === index ? <RemoveOutlined sx={{ fontSize: 20 }} /> : <AddOutlined sx={{ fontSize: 20 }} />}
										</span>
									</button>

									<div className={`transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'max-h-[200px] mt-[16px] opacity-100' : 'max-h-0 opacity-0'}`}>
										<p className="text-[14px] text-[#4B5563] leading-[1.6] pt-[4px]">
											{faq.answer}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Main>
	);
}

export default Pricing;
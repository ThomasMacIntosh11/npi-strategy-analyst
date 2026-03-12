// NPI Strategic Initiatives List
// Source: Vision 2030 Workshop Materials

export const NPI_INITIATIVES = [
  // Initiative 1
  {
    id: 1,
    name: "Career pathways & growth for payroll/payroll adjacent careers",
    department: "Professional Standards & Education",
    type: "Strategic",
    description: "Develop self-paced, self-serve digital and stackable microlearning programs for payroll adjacent roles, potentially in partnership with other organizations. Provide partners, PCP certificate candidates with a white label technology sandbox of simulated payroll data for scenario-based assessments and hands-on practice. Establish NPI as the primary talent marketplace connecting employers with payroll professionals (recruitment service). Develop customized career journey maps for early career non-members & members. Add a practicum pathway to the PCP designation. Build a balanced product portfolio and a product strategy for PD. Establish partnerships with other professional education organizations. Build an internship program for students. Build a peer learning network/platform for AI in payroll. Offer a specialization for PCP/PLP designations.",
    proposingDepartment: "Professional Standards & Education",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "High"
  },

  // Initiative 2.1
  {
    id: 2,
    name: "Compliance advisory services for small businesses",
    department: "Government Relations & Legislative Compliance", 
    type: "Strategic",
    description: "Create a triage system for incoming enquiries that ensures margin is preserved for high-cost calls. Develop tiered pricing and service levels. Package a final, market-ready version of AskPat Pro. Develop a voice-to-talk system for internal AskPat Pro that improves InfoLine effort and consistency. Develop an API for NPI's knowledge base to power external AI tools from PSSPs. Develop a self-serve SMB hub that offers resources and short advisory sessions for unique situations. Create an online tool that helps businesses assess payroll compliance.",
    proposingDepartment: "Government Relations & Legislative Compliance",
    crossFunctional: true,
    staffRequired: "TBD", 
    effortSignal: "Medium"
  },

  // Initiative 2.2
  {
    id: 3,
    name: "Payroll leadership advisory services for medium-large firms",
    department: "Government Relations & Legislative Compliance",
    type: "Strategic", 
    description: "Establish a Volunteer SME Knowledge Network. Launch a Member-Based Advisory Marketplace. Launch implementation and risk assessment audit service.",
    proposingDepartment: "Government Relations & Legislative Compliance",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // Initiative 3
  {
    id: 4,
    name: "Policy advisory, lobbying, op. support, & research for gov't",
    department: "Government Relations & Legislative Compliance",
    type: "Strategic",
    description: "Develop and launch a campaign lobbying for real-time payroll. Develop a research, note-taking and summarizing writing tool for Government committee meetings that improves cost and effort allocation. Develop a policy think tank owned and operated by NPI.",
    proposingDepartment: "Government Relations & Legislative Compliance", 
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "High"
  },

  // Initiative 4
  {
    id: 5, 
    name: "Community engagement for members",
    department: "Public & Member Relations",
    type: "Strategic",
    description: "Sell year-long pre-packaged experiences by persona. Expand the national network and discontinue regional councils. Bring back in person learning at the grassroots level. Implement a loyalty rewards program for members. Establish a national online payroll professional community.",
    proposingDepartment: "Public & Member Relations",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // Initiative 5
  {
    id: 6,
    name: "Financial wellness products for working Canadians", 
    department: "Multiple Teams",
    type: "Strategic",
    description: "Repackage and launch a national financial wellness product for employers (e.g., simple, employee memo product). Create payroll resources by life-stage for working Canadians.",
    proposingDepartment: "Multiple Teams",
    crossFunctional: true,
    staffRequired: "TBD", 
    effortSignal: "Medium-High"
  }
]

// Helper function to get initiative by name (case-insensitive)
export function getInitiativeByName(name: string) {
  return NPI_INITIATIVES.find(init => init.name.toLowerCase() === name.toLowerCase())
}

// Helper function to get initiatives by department
export function getInitiativesByDepartment(department: string) {
  return NPI_INITIATIVES.filter(init => init.department.toLowerCase() === department.toLowerCase())
}

// Helper function to get initiatives by type
export function getInitiativesByType(type: "Strategic" | "Operational" | "Optimization") {
  return NPI_INITIATIVES.filter(init => init.type === type)
}

// Get all initiative names for easy reference
export function getAllInitiativeNames(): string[] {
  return NPI_INITIATIVES.map(init => init.name)
}
    type: "Strategic",
    description: "Redevelop PLP curriculum. Review and enhance PCP content. Explore certificate programs. Integrate Payroll Competency Framework.",
    projectLead: "Manager Research / Manager Learning & Professional Development / VP Professional Standards & Education",
    crossFunctional: true,
    staffRequired: "Multiple leads",
    effortSignal: "High"
  },

  // MEMBER SERVICES
  {
    id: 9,
    name: "Customer Experience Strategy",
    department: "Member Services",
    type: "Operational",
    description: "Improve member/customer experience. Review processes and technology. Persona and journey mapping.",
    projectLead: "Team Lead, Member Services",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // INFORMATION TECHNOLOGY
  {
    id: 10,
    name: "Data Governance Working Group",
    department: "Information Technology",
    type: "Operational",
    description: "Enterprise data governance framework.",
    projectLead: "Director, IT",
    crossFunctional: true,
    staffRequired: 6,
    effortSignal: "Medium"
  },
  {
    id: 11,
    name: "Data Reporting Tool Implementation",
    department: "Information Technology",
    type: "Operational",
    description: "Centralize member data reporting.",
    projectLead: "Director, IT & Business Analyst",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // FINANCE & BUSINESS PLANNING
  {
    id: 12,
    name: "Risk Assessment & Management",
    department: "Finance & Business Planning",
    type: "Operational",
    description: "Enterprise governance layer for risk management.",
    projectLead: "CFO / Risk Committee",
    crossFunctional: true,
    staffRequired: "All departments",
    effortSignal: "High"
  },
  {
    id: 13,
    name: "AP Module Implementation (Sage Intacct replacing Concur)",
    department: "Finance & Business Planning",
    type: "Optimization",
    description: "Replace Concur with Sage Intacct AP module.",
    projectLead: "Controller / Finance Manager",
    crossFunctional: false,
    staffRequired: 2,
    effortSignal: "Low-Medium"
  },
  {
    id: 14,
    name: "Full Utilization of Sage Intacct & Planning",
    department: "Finance & Business Planning",
    type: "Optimization",
    description: "Implement comprehensive financial planning and decision-support capabilities.",
    projectLead: "CFO / Controller",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // GOVERNANCE
  {
    id: 15,
    name: "Emerging Leaders Committee",
    department: "Governance",
    type: "Operational",
    description: "Leadership development initiative.",
    projectLead: "Executive Director",
    crossFunctional: false,
    staffRequired: "TBD",
    effortSignal: "Low"
  },
  {
    id: 16,
    name: "NPI Popup Store",
    department: "Governance",
    type: "Operational",
    description: "Member engagement retail experience.",
    projectLead: "Member Services Lead",
    crossFunctional: true,
    staffRequired: 4,
    effortSignal: "Medium"
  },
  {
    id: 17,
    name: "EDI Training for Volunteers",
    department: "Governance",
    type: "Operational",
    description: "Equity, Diversity, and Inclusion training program.",
    projectLead: "HR / Executive Director",
    crossFunctional: true,
    staffRequired: 6,
    effortSignal: "Medium"
  },

  // PUBLIC RELATIONS
  {
    id: 18,
    name: "NPW Campaign – 'Payroll Has Your Back'",
    department: "Public Relations",
    type: "Strategic",
    description: "National Payroll Week campaign positioning payroll as essential support.",
    projectLead: "Manager, PR",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Medium"
  },
  {
    id: 19,
    name: "Member Retention Initiative",
    department: "Public Relations",
    type: "Operational",
    description: "Program to improve member retention and engagement.",
    projectLead: "Marketing Specialist",
    crossFunctional: true,
    staffRequired: 1,
    effortSignal: "Medium"
  },
  {
    id: 20,
    name: "CSR Brand Equity Program",
    department: "Public Relations",
    type: "Strategic",
    description: "Corporate Social Responsibility initiatives to build brand value.",
    projectLead: "Marketing Communications Specialist",
    crossFunctional: true,
    staffRequired: 6,
    effortSignal: "High"
  },

  // LEARNING & PROFESSIONAL DEVELOPMENT
  {
    id: 21,
    name: "Quebec-Focused PD Strategy",
    department: "Learning & Professional Development",
    type: "Operational",
    description: "Tailored professional development programs for Quebec market.",
    projectLead: "Manager, Learning & Professional Development",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },
  {
    id: 22,
    name: "PPQ to PCP Migration Learning Offering",
    department: "Learning & Professional Development",
    type: "Operational",
    description: "Learning support for migration from PPQ to PCP designation.",
    projectLead: "Manager, Learning & Professional Development",
    crossFunctional: true,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },

  // PROFESSIONAL ACCREDITATION & STANDARDS
  {
    id: 23,
    name: "PPQ Designation Dissolution",
    department: "Professional Accreditation & Standards",
    type: "Strategic",
    description: "Manage sunsetting of PPQ designation and migration to PCP.",
    projectLead: "VP, Professional Standards & Education",
    crossFunctional: true,
    staffRequired: "4+",
    effortSignal: "High"
  },
  {
    id: 24,
    name: "Revamped PLP Implementation",
    department: "Professional Accreditation & Standards",
    type: "Strategic",
    description: "Implement updated Payroll Learning Program.",
    projectLead: "VP, Professional Standards & Education",
    crossFunctional: true,
    staffRequired: "4+",
    effortSignal: "High"
  },

  // GOVERNMENT & LEGISLATIVE AFFAIRS
  {
    id: 25,
    name: "BC Lobbying Registration & GR Support",
    department: "Government & Legislative Affairs",
    type: "Operational",
    description: "Regulatory compliance and government relations activities in BC.",
    projectLead: "VP, Government Relations and Legislative Compliance",
    crossFunctional: true,
    staffRequired: 1,
    effortSignal: "Low-Medium"
  },
  {
    id: 26,
    name: "GLA Section in PD Workshops",
    department: "Government & Legislative Affairs",
    type: "Operational",
    description: "Integration of government and legislative affairs content in professional development.",
    projectLead: "VP, Government Relations and Legislative Compliance",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Medium"
  },
  {
    id: 27,
    name: "Administrative Burden Interactive Tool",
    department: "Government & Legislative Affairs",
    type: "Operational",
    description: "Tool to quantify and communicate regulatory burden.",
    projectLead: "VP, Government Relations and Legislative Compliance",
    crossFunctional: true,
    staffRequired: 1,
    effortSignal: "Low-Medium"
  },

  // COMPLIANCE SERVICES
  {
    id: 28,
    name: "Mini Webinar Series",
    department: "Compliance Services",
    type: "Operational",
    description: "Short-form educational content series for members.",
    projectLead: "Compliance Services Lead",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Low-Medium"
  },
  {
    id: 29,
    name: "Consulting Services Strategy Development",
    department: "Compliance Services",
    type: "Operational",
    description: "Develop strategy for member consulting services offerings.",
    projectLead: "Compliance Services Lead",
    crossFunctional: true,
    staffRequired: 3,
    effortSignal: "Medium"
  },
  {
    id: 30,
    name: "ASK PAT 2.0 (AI Knowledge Tool)",
    department: "Compliance Services",
    type: "Strategic",
    description: "AI-enabled member support tool for compliance questions.",
    projectLead: "Compliance Services Lead / IT Director",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Medium"
  },
  {
    id: 31,
    name: "Tools & Resources Strategy",
    department: "Compliance Services",
    type: "Operational",
    description: "Comprehensive strategy for member tools and resources.",
    projectLead: "Compliance Services Lead",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Medium"
  },

  // HUMAN RESOURCES
  {
    id: 32,
    name: "Experience Road Map",
    department: "Human Resources",
    type: "Operational",
    description: "Employee experience improvement initiative.",
    projectLead: "HR Manager / Director",
    crossFunctional: false,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },
  {
    id: 33,
    name: "Learning & Development (Internal)",
    department: "Human Resources",
    type: "Operational",
    description: "Internal staff training and development programs.",
    projectLead: "HR Manager / Director",
    crossFunctional: false,
    staffRequired: "TBD",
    effortSignal: "Medium"
  },
  {
    id: 34,
    name: "HR Communications Strategy",
    department: "Human Resources",
    type: "Operational",
    description: "Internal communications framework for HR initiatives.",
    projectLead: "HR Manager / Director",
    crossFunctional: true,
    staffRequired: 2,
    effortSignal: "Low-Medium"
  },
  {
    id: 35,
    name: "Employee Recognition",
    department: "Human Resources",
    type: "Operational",
    description: "Program to recognize and celebrate employee contributions.",
    projectLead: "HR Manager / Director",
    crossFunctional: false,
    staffRequired: 1,
    effortSignal: "Low"
  }
]

// Helper function to get initiative by name (case-insensitive)
export function getInitiativeByName(name: string) {
  return NPI_INITIATIVES.find(init => init.name.toLowerCase() === name.toLowerCase())
}

// Helper function to get initiatives by department
export function getInitiativesByDepartment(department: string) {
  return NPI_INITIATIVES.filter(init => init.department.toLowerCase() === department.toLowerCase())
}

// Helper function to get initiatives by type
export function getInitiativesByType(type: "Strategic" | "Operational" | "Optimization") {
  return NPI_INITIATIVES.filter(init => init.type === type)
}

// Get all initiative names for easy reference
export function getAllInitiativeNames(): string[] {
  return NPI_INITIATIVES.map(init => init.name)
}

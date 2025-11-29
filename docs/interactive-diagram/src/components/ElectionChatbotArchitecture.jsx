import React, { useState } from 'react';
import {
  Database,
  Lock,
  MessageSquare,
  FileText,
  Search,
  Cpu,
  Cloud,
  GitBranch,
  Container,
  Zap,
  Upload,
  Users,
  ArrowRight,
  CheckCircle,
  Activity,
  Layers,
  BadgeAlert
} from 'lucide-react';

// FlowButton component defined at module scope (avoids recreation during render)
const FlowButton = ({ id, label, activeFlow, setActiveFlow }) => (
  <button
    onClick={() => setActiveFlow(id)}
    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
      activeFlow === id
        ? 'bg-blue-600 text-white'
        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
    }`}
  >
    {label}
  </button>
);

export default function ElectionChatbotArchitecture() {
  const [activeFlow, setActiveFlow] = useState('overview');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-800">
          Citizen Impact - Election Information Chatbot
        </h1>

        {/* Flow Selection */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <FlowButton id="overview" label="📊 Overview" activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
          <FlowButton id="multiagent" label="🤖 Multi-Agent Architecture" activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
          <FlowButton id="ingestion" label="📄 Document Ingestion" activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
          <FlowButton id="query" label="💬 User Query Flow" activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
          <FlowButton id="auth" label="🔒 Authentication Flow" activeFlow={activeFlow} setActiveFlow={setActiveFlow} />
        </div>

        {/* Overview */}
        {activeFlow === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">System Overview</h2>

              <p className="text-slate-600 mb-4">
                This application documents a production-oriented RAG Election Chatbot. The repo includes a FastAPI backend,
                Prompt Flow orchestration for LLM + retrieval, and a Next.js frontend. The system uses a multi-agent architecture
                to split responsibilities across specialized agents (ingestion, embedding, retrieval, answer generation,
                verification & orchestration). See the Multi-Agent Architecture tab for full details.
              </p>
              
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Container className="w-5 h-5" />
                  Deployment Pipeline
                </h3>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">GitHub</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <GitBranch className="w-10 h-10 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">GitHub Actions</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <Container className="w-10 h-10 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Container Registry</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <Cloud className="w-10 h-10 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Azure Services</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Frontend */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Frontend Layer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <span>Azure App Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">N</span>
                      </div>
                      <span>Next.js</span>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded text-xs">
                      <p className="font-medium mb-1">Features:</p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Chat Interface</li>
                        <li>• Candidate Search</li>
                        <li>• Proposal Browser</li>
                        <li>• Admin Dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Processing */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">AI Processing</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      <span>Azure AI Foundry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span>FastAPI + Prompt Flow</span>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded text-xs">
                      <p className="font-medium mb-1">Capabilities:</p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• OCR & Text Extraction</li>
                        <li>• Document Embedding</li>
                        <li>• RAG Pipeline</li>
                        <li>• GPT-4o Response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-3">Data Layer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <span>Azure Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-cyan-600" />
                      <span>Azure AI Search</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-600" />
                      <span>CosmosDB</span>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded text-xs">
                      <p className="font-medium mb-1">Stores:</p>
                      <ul className="space-y-1 text-slate-600">
                        <li>• Documents (Blob)</li>
                        <li>• Vectors (AI Search)</li>
                        <li>• Metadata (Cosmos)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 text-sm text-slate-600">
                <p className="font-medium mb-2">Multi-Agent Prompt-Flow (summary):</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>User question → Intent &amp; Entity Classifier Agent (extracts intent, candidates, topics)</li>
                  <li>Retriever Agent → semantic + metadata search (Azure AI Search) returns top-K evidence with page numbers</li>
                  <li>Policy Summarizer Agent → converts evidence into concise, voter-friendly bullets with suggested citations</li>
                  <li>Verification / Fact-Check Agent → cross-checks bullets against sources and flags unsupported claims</li>
                  <li>Safety / Neutrality Agent → removes persuasive language, applies content rules, adds disclaimers or human-review flags</li>
                  <li>Final Answer Assembler → builds the final response with transparent citations and returns to the UI</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Agent Architecture */}
        {activeFlow === 'multiagent' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-emerald-200">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-800 flex items-center gap-2">
                <Activity className="w-7 h-7" />
                Multi-Agent Architecture
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium mb-1">User Query</p>
                    <p className="italic text-slate-700">e.g., "What is Maria Silva’s position on education?"</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-slate-700" />
                      1. Intent & Entity Classifier Agent
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Detects user intent and extracts entities</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Detects user intent: <span className="font-medium">candidate_position_query, candidate_comparison, topic_exploration, general election info</span></li>
                      <li>Extracts: <span className="font-medium">candidate names, policy topic (education, health…), question type</span></li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Search className="w-5 h-5 text-cyan-600" />
                      2. Proposal Retriever (RAG Agent)
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Performs semantic retrieval and returns top-K context chunks</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Performs semantic search in Azure Search</li>
                      <li>Applies filters: <span className="font-medium">candidate_name == "Maria Silva"; optional: topic == "education"</span></li>
                      <li>Retrieves: proposal chunks, section titles, <span className="font-medium">PAGE NUMBERS (mandatory for citations)</span></li>
                      <li>Returns TOP-K context chunks</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      3. Policy Summarization & Explanation Agent
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Converts policy text into voter-friendly summaries</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Produces concise bullet points</li>
                      <li>Creates human-readable explanation and low-complexity summary</li>
                      <li className="font-medium">Must NOT invent claims</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <BadgeAlert className="w-5 h-5 text-red-600" />
                      4. Verification / Fact-Check Agent
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Cross-checks every summary bullet against sources</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Cross-checks against retrieved context and metadata (page, chunk)</li>
                      <li>Flags unsupported claims as <span className="font-medium">“NOT FOUND IN SOURCE”</span></li>
                      <li>Ensures no hallucinations and produces a VERIFIED SUMMARY</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-700" />
                      5. Comparison Agent (Optional)
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Activated for comparison queries</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Dual RAG retrieval for both candidates</li>
                      <li>Side-by-side comparison with citations from BOTH proposals</li>
                      <li>Example trigger: “Compare Maria Silva and João Pereira on health”</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-red-600" />
                      6. Safety / Neutrality Agent
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">Enforces neutrality and prevents persuasion</p>
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      <li>Removes political persuasion and endorsements</li>
                      <li>Prevents disinformation; ensures neutral, factual answers</li>
                      <li>Adds disclaimers when needed</li>
                    </ul>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-semibold mb-2">Final Answer Assembler & Citation Engine</h4>
                    <p className="text-sm text-emerald-800 mb-2">Builds the final voter-friendly output with transparent citations</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="p-3 bg-slate-50 rounded text-sm">
                        <p className="font-medium mb-2">Response:</p>
                        <p className="text-slate-700 mb-3">
                          According to her official proposal, Maria Silva's education reform plan focuses on three main areas: increasing teacher salaries by 15%, expanding access to early childhood education, and investing in technology infrastructure for public schools.
                        </p>
                        <div className="border-t pt-2 mt-2">
                          <p className="text-xs font-medium text-slate-500 mb-1">Sources:</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-blue-600">
                              <FileText className="w-3 h-3" />
                              <span>Maria Silva Proposal 2024, pages 5, 12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="text-xs text-slate-600 list-disc list-inside mt-2">
                      <li>Ensures clean formatting, transparent citations, and page numbers included</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
                  <h3 className="font-semibold mb-2">System Services & Infrastructure Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-medium mb-2">Azure Services</h4>
                      <ul className="text-xs text-slate-600 list-disc list-inside">
                        <li><span className="font-medium">Azure Blob Storage:</span> Stores candidate PDFs and text versions of proposals</li>
                        <li><span className="font-medium">Azure Cognitive Search (Vector Index):</span> Stores chunks, embeddings, metadata (candidate, page, topic)</li>
                        <li><span className="font-medium">Azure Functions:</span> Automatic ingestion, PDF → text extraction, chunking + embedding, reindexing</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-medium mb-2">Backend Layer (FastAPI)</h4>
                      <ul className="text-xs text-slate-600 list-disc list-inside">
                          <li><code>/signup</code> — register new users (passwords hashed with <code>passlib[argon2]</code>)</li>
                          <li><code>/signin</code> — return JWT access token</li>
                          <li><code>/chat</code> — persist user message, call Prompt Flow orchestration (env var <code>PF_ENDPOINT_URL</code>), persist assistant reply</li>
                          <li><code>/history/{`{session_id}`}</code> — fetch ordered chat history from CosmosDB</li>
                          <li>Backend notes: uses `azure-cosmos` (CosmosDB), `httpx` for HTTP calls, and exposes a `Dockerfile`</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-medium mb-2">Agents Engine</h4>
                      <p className="text-xs text-slate-600">Could be implemented using:</p>
                      <ul className="text-xs text-slate-600 list-disc list-inside">
                        <li>OpenAI Agents</li>
                        <li>Prompt Flow Agents</li>
                        <li>CrewAI</li>
                        <li>Microsoft Semantic Kernel</li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-2">(Your choice — I can generate code for any.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Ingestion Flow (FULL detailed original markup) */}
        {activeFlow === 'ingestion' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-orange-200">
              <h2 className="text-2xl font-semibold mb-4 text-orange-800 flex items-center gap-2">
                <Upload className="w-7 h-7" />
                Document Ingestion Pipeline
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-lg mb-2">Admin Upload</h3>
                    <p className="text-sm text-slate-600 mb-3">Admin authenticates and uploads official documents through the web interface</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Supported Files:</p>
                        <ul className="text-xs text-slate-600 mt-1">
                          <li>• PDF documents</li>
                          <li>• Text files (.txt)</li>
                          <li>• Word documents (.docx)</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Metadata:</p>
                        <ul className="text-xs text-slate-600 mt-1">
                          <li>• Document type</li>
                          <li>• Candidate name</li>
                          <li>• Election year</li>
                          <li>• Upload timestamp</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-lg mb-2">Storage Upload</h3>
                    <p className="text-sm text-slate-600 mb-3">Document is uploaded to Azure Blob Storage</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-orange-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Azure Storage Account</p>
                          <p className="text-xs text-slate-600">Container: election-documents</p>
                          <p className="text-xs text-slate-500 mt-1">Path: /year/candidate/document.pdf</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">OCR and Text Extraction</h3>
                    <p className="text-sm text-slate-600 mb-3">Azure AI Document Intelligence extracts text from the document</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm mb-2">Processing:</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Extract text from PDF</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Preserve formatting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Extract tables</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span>Handle scanned docs</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Service:</p>
                        <p className="text-xs text-slate-600 mt-1">Azure Cognitive Services</p>
                        <p className="text-xs text-slate-600">Document Intelligence API</p>
                        <p className="text-xs text-purple-600 font-medium mt-2">Output: Raw text</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">Text Chunking</h3>
                    <p className="text-sm text-slate-600 mb-3">Split document into manageable chunks for embedding</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Chunk Size</p>
                          <p className="text-lg font-bold text-purple-600">1000</p>
                          <p className="text-xs text-slate-600">tokens</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Overlap</p>
                          <p className="text-lg font-bold text-purple-600">200</p>
                          <p className="text-xs text-slate-600">tokens</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Strategy</p>
                          <p className="text-sm font-bold text-purple-600">Recursive</p>
                          <p className="text-xs text-slate-600">by sentence</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">5</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">Generate Embeddings</h3>
                    <p className="text-sm text-slate-600 mb-3">Convert text chunks into vector embeddings</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Model:</p>
                        <p className="text-xs text-purple-600 font-mono mt-1">text-embedding-ada-002</p>
                        <p className="text-xs text-slate-500 mt-2">Dimensions: 1536</p>
                        <p className="text-xs text-slate-500">Provider: Azure OpenAI</p>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Output:</p>
                        <p className="text-xs text-slate-600 mt-1">Vector representation of each chunk</p>
                        <p className="text-xs text-slate-500 mt-2">Preserves semantic meaning</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 6 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">6</div>
                  <div className="flex-1 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <h3 className="font-semibold text-lg mb-2">Store in Vector Database</h3>
                    <p className="text-sm text-slate-600 mb-3">Save embeddings to Azure AI Search for semantic retrieval</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="flex items-center gap-3 mb-3">
                        <Search className="w-8 h-8 text-cyan-600" />
                        <div>
                          <p className="font-medium text-sm">Azure AI Search</p>
                          <p className="text-xs text-slate-600">Vector Store Index</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-cyan-50 rounded">
                          <p className="font-medium">Stored Data:</p>
                          <ul className="text-slate-600 mt-1 space-y-1">
                            <li>• Vector embedding</li>
                            <li>• Original text chunk</li>
                            <li>• Document metadata</li>
                            <li>• Chunk position</li>
                          </ul>
                        </div>
                        <div className="p-2 bg-cyan-50 rounded">
                          <p className="font-medium">Index Config:</p>
                          <ul className="text-slate-600 mt-1 space-y-1">
                            <li>• Similarity: Cosine</li>
                            <li>• Searchable fields</li>
                            <li>• Filterable metadata</li>
                            <li>• Hybrid search ready</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 7 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">7</div>
                  <div className="flex-1 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-lg mb-2">Update Database</h3>
                    <p className="text-sm text-slate-600 mb-3">Store document metadata in CosmosDB</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="flex items-center gap-3 mb-3">
                        <Database className="w-8 h-8 text-indigo-600" />
                        <div>
                          <p className="font-medium text-sm">Azure CosmosDB (MongoDB API)</p>
                          <p className="text-xs text-slate-600">Collection: documents</p>
                        </div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded text-xs overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{`{
  "id": "doc_12345",
  "filename": "candidate_proposal.pdf",
  "candidateName": "John Doe",
  "electionYear": 2024,
  "documentType": "proposal",
  "uploadDate": "2024-01-15",
  "totalChunks": 45,
  "status": "indexed"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success */}
                <div className="flex justify-center mt-6">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Document Successfully Indexed!</p>
                      <p className="text-sm text-green-600">Ready for semantic search and retrieval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Query Flow (FULL detailed original markup) */}
        {activeFlow === 'query' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-emerald-200">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-800 flex items-center gap-2">
                <MessageSquare className="w-7 h-7" />
                User Query Flow (RAG Pipeline)
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-2">User Submits Question</h3>
                    <p className="text-sm text-slate-600 mb-3">User types a question in the chat interface</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <p className="font-medium text-sm">Example Query:</p>
                      </div>
                      <p className="text-sm italic text-slate-700 bg-slate-50 p-3 rounded">
                        "What is candidate Maria Silva's position on education reform?"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-2">Authentication Check</h3>
                    <p className="text-sm text-slate-600 mb-3">Verify JWT token and user permissions</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <Lock className="w-6 h-6 text-red-600 mb-2" />
                        <p className="font-medium text-sm">Token Validation:</p>
                        <ul className="text-xs text-slate-600 mt-1 space-y-1">
                          <li>• Verify signature</li>
                          <li>• Check expiration</li>
                          <li>• Validate issuer</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">User Info:</p>
                        <ul className="text-xs text-slate-600 mt-1 space-y-1">
                          <li>• User ID</li>
                          <li>• Role (user/admin)</li>
                          <li>• Permissions</li>
                          <li>• Rate limits</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 3: Intent & Entity Classifier Agent */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div className="flex-1 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h3 className="font-semibold text-lg mb-2">Intent &amp; Entity Classifier Agent</h3>
                    <p className="text-sm text-slate-600 mb-3">Detects user intent and extracts entities (candidate names, topics, question type) to route the query.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm mb-2">Outputs:</p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          <li>• Intent (e.g., candidate_position_query, comparison)</li>
                          <li>• Entities (candidateName, topic, timeframe)</li>
                          <li>• Routing hints (compare vs single-candidate flow)</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm mb-2">Example:</p>
                        <p className="text-xs text-slate-600">Input: "Compare Maria Silva and João Pereira on health" → Intent: comparison; Entities: [Maria Silva, João Pereira], topic: health</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 4: Proposal Retriever (RAG Agent) + Azure Search / Vector Search */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
                  <div className="flex-1 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h3 className="font-semibold text-lg mb-2">Proposal Retriever (RAG Agent) — Azure Search / Vector Search</h3>
                    <p className="text-sm text-slate-600 mb-3">Performs semantic retrieval using the query (or entity-enhanced query) against Azure AI Search vector index and metadata filters.</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Search Details:</p>
                        <ul className="text-xs text-slate-600 mt-1 space-y-1">
                          <li>• Embedding model: `text-embedding-ada-002` (provider: Azure OpenAI)</li>
                          <li>• Similarity: Cosine; Top-K results (5-10)</li>
                          <li>• Filters: candidate name, document type, election year</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Returned data:</p>
                        <ul className="text-xs text-slate-600 mt-1 space-y-1">
                          <li>• Chunks with score, source doc, page numbers</li>
                          <li>• Metadata for citation and filtering</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 5: Policy Summarization & Explanation Agent */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">5</div>
                  <div className="flex-1 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <h3 className="font-semibold text-lg mb-2">Policy Summarization &amp; Explanation Agent</h3>
                    <p className="text-sm text-slate-600 mb-3">Converts retrieved policy chunks into concise, voter-friendly summaries and explanatory bullets (no invention).</p>
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-sm mb-2">Output:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Short bullets with plain-language explanations</li>
                        <li>• Suggested citations (doc + page numbers) for each claim</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 6: Verification / Fact-Check Agent */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">6</div>
                  <div className="flex-1 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <h3 className="font-semibold text-lg mb-2">Verification / Fact-Check Agent</h3>
                    <p className="text-sm text-slate-600 mb-3">Cross-checks each summary bullet against retrieved context and metadata; flags unsupported claims.</p>
                    <div className="p-3 bg-white rounded border">
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Verifies every claim against source chunks (page numbers required for citations)</li>
                        <li>• Flags items as <span className="font-medium">"NOT FOUND IN SOURCE"</span> when unsupported</li>
                        <li>• Produces verified-summary and provenance for transparency</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 7: Safety / Neutrality Agent */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">7</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">Safety / Neutrality Agent</h3>
                    <p className="text-sm text-slate-600 mb-3">Applies safety checks and neutrality filters to remove persuasion, policy bias, or disallowed content; adds disclaimers when required.</p>
                    <div className="p-3 bg-white rounded border">
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Removes persuasive language and endorsements</li>
                        <li>• Applies content safety rules and rate-limit hints</li>
                        <li>• Adds human-review flag when confidence is low</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 7 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">7</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">Build Prompt</h3>
                    <p className="text-sm text-slate-600 mb-3">Construct prompt with context for LLM</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="space-y-2 text-xs">
                        <div className="p-2 bg-purple-50 rounded">
                          <p className="font-medium">System Prompt:</p>
                          <p className="text-slate-600 italic">"You are an election information assistant. Answer based only on provided documents..."</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <p className="font-medium">Context:</p>
                          <p className="text-slate-600">[Retrieved chunks inserted here]</p>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <p className="font-medium">User Question:</p>
                          <p className="text-slate-600 italic">"What is Maria Silva's position on education reform?"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 8 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">8</div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-2">Generate Response (GPT-4o)</h3>
                    <p className="text-sm text-slate-600 mb-3">Azure OpenAI generates answer with citations</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="font-medium text-sm">Model:</p>
                        <p className="text-xs text-purple-600 font-mono mt-1">GPT-4o</p>
                        <p className="text-xs text-slate-600 mt-2">Temperature: 0.3</p>
                        <p className="text-xs text-slate-600">Max tokens: 800</p>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-sm">Instructions:</p>
                        <ul className="text-xs text-slate-600 mt-1 space-y-1">
                          <li>• Answer from context only</li>
                          <li>• Cite sources</li>
                          <li>• Be factual and neutral</li>
                          <li>• Admit if info missing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                

                {/* Step 9 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">9</div>
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-2">Display Response</h3>
                    <p className="text-sm text-slate-600 mb-3">Show answer with citations to user</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="p-3 bg-slate-50 rounded text-sm">
                        <p className="font-medium mb-2">Response:</p>
                        <p className="text-slate-700 mb-3">
                          According to her official proposal, Maria Silva's education reform plan focuses on three main areas: increasing teacher salaries by 15%, expanding access to early childhood education, and investing in technology infrastructure for public schools.
                        </p>
                        <div className="border-t pt-2 mt-2">
                          <p className="text-xs font-medium text-slate-500 mb-1">Sources:</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-blue-600">
                              <FileText className="w-3 h-3" />
                              <span>Maria Silva Proposal 2024, pages 5, 12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success */}
                <div className="flex justify-center mt-6">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Query Successfully Processed!</p>
                      <p className="text-sm text-green-600">User receives accurate, cited information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        

        {/* Authentication Flow */}
        {activeFlow === 'auth' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-200">
              <h2 className="text-2xl font-semibold mb-4 text-red-800 flex items-center gap-2">
                <Lock className="w-7 h-7" />
                Authentication Flow
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="flex-1 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-lg mb-2">User Login Request</h3>
                    <p className="text-sm text-slate-600 mb-3">User submits credentials</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-medium">Credentials:</p>
                          <ul className="text-slate-600 mt-1 space-y-1">
                            <li>• Email</li>
                            <li>• Password (hashed)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium">Alternative:</p>
                          <ul className="text-slate-600 mt-1 space-y-1">
                            <li>• OAuth (Google, etc)</li>
                            <li>• SSO integration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="flex-1 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-lg mb-2">Verify Credentials</h3>
                    <p className="text-sm text-slate-600 mb-3">Check against user database</p>
                    <div className="p-3 bg-white rounded border">
                      <Database className="w-6 h-6 text-indigo-600 mb-2" />
                      <p className="text-xs text-slate-600">Query CosmosDB users collection</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-8 h-8 text-slate-400 rotate-90" />
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div className="flex-1 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-semibold text-lg mb-2">Generate JWT Token</h3>
                    <p className="text-sm text-slate-600 mb-3">Create signed token with user info</p>
                    <div className="p-3 bg-white rounded border">
                      <div className="text-xs overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{`{
  "userId": "user_123",
  "email": "user@example.com",
  "role": "user",
  "permissions": ["query", "view"],
  "exp": 1700000000,
  "iat": 1699990000
}`}</pre>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Token expires in: 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.webhook_.md
Latest content with line numbers:
1	# Webhook node documentation | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
4	
5	---
6	
7	Skip to content
8	n8n Docs
9	Chat with the docs
10	Type to start searching
11	Using n8n
12	Integrations
13	Hosting n8n
14	Code in n8n
15	Advanced AI
16	API
17	Embed
18	n8n home ↗
19	Forum ↗
20	Tutorials (blog) ↗
21	Integrations
22	Built-in nodes
23	Node types
24	Core nodes
25	Activation Trigger
26	Aggregate
27	AI Transform
28	Code
29	Compare Datasets
30	Compression
31	Chat Trigger
32	Convert to File
33	Crypto
34	Data table
35	Date & Time
36	Debug Helper
37	Edit Fields (Set)
38	Edit Image
39	Email Trigger (IMAP)
40	Error Trigger
41	Evaluation
42	Evaluation Trigger
43	Execute Command
44	Execute Sub-workflow
45	Execute Sub-workflow Trigger
46	Execution Data
47	Extract From File
48	Filter
49	FTP
50	Git
51	GraphQL
52	HTML
53	HTTP Request
54	If
55	JWT
56	LDAP
57	Limit
58	Local File Trigger
59	Loop Over Items (Split in Batches)
60	Manual Trigger
61	Markdown
62	MCP Server Trigger
63	Merge
64	n8n
65	n8n Form
66	n8n Form Trigger
67	n8n Trigger
68	No Operation, do nothing
69	Read/Write Files from Disk
70	Remove Duplicates
71	Rename Keys
72	Respond to Chat
73	Respond to Webhook
74	RSS Read
75	RSS Feed Trigger
76	Schedule Trigger
77	Send Email
78	Sort
79	Split Out
80	SSE Trigger
81	SSH
82	Stop And Error
83	Summarize
84	Switch
85	TOTP
86	Wait
87	Webhook
88	Workflow development
89	Common issues
90	Workflow Trigger
91	XML
92	Actions
93	Triggers
94	Cluster nodes
95	Credentials
96	Custom API actions for existing nodes
97	Handle rate limits
98	Community nodes
99	Installation and management
100	Risks
101	Blocklist
102	Using community nodes
103	Troubleshooting
104	Building community nodes
105	Creating nodes
106	Overview
107	Plan your node
108	Build your node
109	Test your node
110	Deploy your node
111	Table of contents
112	Workflow development process
113	Node parameters
114	Webhook URLs
115	HTTP Method
116	Path
117	Supported authentication methods
118	Respond
119	Response Code
120	Response Data
121	Node options
122	How n8n secures HTML responses
123	Templates and examples
124	Common issues
125	Integrations
126	Built-in nodes
127	Core nodes
128	Webhook
129	Webhook node#
130	
131	Use the Webhook node to create webhooks, which can receive data from apps and services when an event occurs. It's a trigger node, which means it can start an n8n workflow. This allows services to connect to n8n and run a workflow.
132	
133	You can use the Webhook node as a trigger for a workflow when you want to receive data and run a workflow based on the data. The Webhook node also supports returning the data generated at the end of a workflow. This makes it useful for building a workflow to process data and return the results, like an API endpoint.
134	
135	The webhook allows you to trigger workflows from services that don't have a dedicated app trigger node.
136	
137	Workflow development process#
138	
139	n8n provides different Webhook URLs for testing and production. The testing URL includes an option to Listen for test event. Refer to Workflow development for more information on building, testing, and shifting your Webhook node to production.
140	
141	Node parameters#
142	
143	Use these parameters to configure your node.
144	
145	Webhook URLs#
146	
147	The Webhook node has two Webhook URLs: test and production. n8n displays the URLs at the top of the node panel.
148	
149	Select Test URL or Production URL to toggle which URL n8n displays.
150	
151	Sample Webhook URLs in the Webhook node's Parameters tab
152	Test: n8n registers a test webhook when you select Listen for Test Event or Execute workflow, if the workflow isn't active. When you call the webhook URL, n8n displays the data in the workflow.
153	Production: n8n registers a production webhook when you activate the workflow. When using the production URL, n8n doesn't display the data in the workflow. You can still view workflow data for a production execution: select the Executions tab in the workflow, then select the workflow execution you want to view.
154	HTTP Method#
155	
156	The Webhook node supports standard HTTP Request Methods:
157	
158	DELETE
159	GET
160	HEAD
161	PATCH
162	POST
163	
164	PUT
165	
166	Webhook max payload
167	
168	The webhook maximum payload size is 16MB. If you're self-hosting n8n, you can change this using the endpoint environment variable N8N_PAYLOAD_SIZE_MAX.
169	
170	Path#
171	
172	By default, this field contains a randomly generated webhook URL path, to avoid conflicts with other webhook nodes.
173	
174	You can manually specify a URL path, including adding route parameters. For example, you may need to do this if you use n8n to prototype an API and want consistent endpoint URLs.
175	
176	The Path field can take the following formats:
177	
178	/:variable
179	/path/:variable
180	/:variable/path
181	/:variable1/path/:variable2
182	/:variable1/:variable2
183	Supported authentication methods#
184	
185	You can require authentication for any service calling your webhook URL. Choose from these authentication methods:
186	
187	Basic auth
188	Header auth
189	JWT auth
190	None
191	
192	Refer to Webhook credentials for more information on setting up each credential type.
193	
194	Respond#
195	Immediately: The Webhook node returns the response code and the message Workflow got started.
196	When Last Node Finishes: The Webhook node returns the response code and the data output from the last node executed in the workflow.
197	Using 'Respond to Webhook' Node: The Webhook node responds as defined in the Respond to Webhook node.
198	Streaming response: Enables real-time data streaming back to the user as the workflow processes. Requires nodes with streaming support in the workflow (for example, the AI agent node).
199	Response Code#
200	
201	Customize the HTTP response code that the Webhook node returns upon successful execution. Select from common response codes or create a custom code.
202	
203	Response Data#
204	
205	Choose what data to include in the response body:
206	
207	All Entries: The Webhook returns all the entries of the last node in an array.
208	First Entry JSON: The Webhook returns the JSON data of the first entry of the last node in a JSON object.
209	First Entry Binary: The Webhook returns the binary data of the first entry of the last node in a binary file.
210	No Response Body: The Webhook returns without a body.
211	
212	Applies only to Respond > When Last Node Finishes.
213	
214	Node options#
215	
216	Select Add Option to view more configuration options. The available options depend on your node parameters. Refer to the table for option availability.
217	
218	Allowed Origins (CORS): Set the permitted cross-origin domains. Enter a comma-separated list of URLs allowed for cross-origin non-preflight requests. Use * (default) to allow all origins.
219	Binary Property: Enabling this setting allows the Webhook node to receive binary data, such as an image or audio file. Enter the name of the binary property to write the data of the received file to.
220	Ignore Bots: Ignore requests from bots like link previewers and web crawlers.
221	IP(s) Whitelist: Enable this to limit who (or what) can invoke a Webhook trigger URL. Enter a comma-separated list of allowed IP addresses. Access from IP addresses outside the whitelist throws a 403 error. If left blank, all IP addresses can invoke the webhook trigger URL.
222	No Response Body: Enable this to prevent n8n sending a body with the response.
223	Raw Body: Specify that the Webhook node will receive data in a raw format, such as JSON or XML.
224	Response Content-Type: Choose the format for the webhook body.
225	Response Data: Send custom data with the response.
226	Response Headers: Send extra headers in the Webhook response. Refer to MDN Web Docs | Response header to learn more about response headers.
227	Property Name: by default, n8n returns all available data. You can choose to return a specific JSON key, so that n8n returns the value.
228	Option	Required node configuration
229	Allowed Origins (CORS)	Any
230	Binary Property	Either:
231	HTTP Method > POST
232	HTTP Method > PATCH
233	HTTP Method > PUT
234	Ignore Bots	Any
235	IP(s) Whitelist	Any
236	Property Name	Both:
237	Respond > When Last Node Finishes
238	Response Data > First Entry JSON
239	No Response Body	Respond > Immediately
240	Raw Body	Any
241	Response Code	Any except Respond > Using 'Respond to Webhook' Node
242	Response Content-Type	Both:
243	Respond > When Last Node Finishes
244	Response Data > First Entry JSON
245	Response Data	Respond > Immediately
246	Response Headers	Any
247	How n8n secures HTML responses#
248	
249	Starting with n8n version 1.103.0, n8n automatically wraps HTML responses to webhooks in <iframe> tags. This is a security mechanism to protect the instance users.
250	
251	This has the following implications:
252	
253	HTML renders in a sandboxed iframe instead of directly in the parent document.
254	JavaScript code that attempts to access the top-level window or local storage will fail.
255	Authentication headers aren't available in the sandboxed iframe (for example, basic auth). You need to use an alternative approach, like embedding a short-lived access token within the HTML.
256	Relative URLs (for example, <form action="/">) won't work. Use absolute URLs instead.
257	Templates and examples#
258	📚 Auto-generate documentation for n8n workflows with GPT and Docsify
259	
260	by Eduard
261	
262	View template details
263	Automate Customer Support with Mintlify Documentation & Zendesk AI Agent
264	
265	by Alex Gurinovich
266	
267	View template details
268	Transform Cloud Documentation into Security Baselines with OpenAI and GDrive
269	
270	by Raphael De Carvalho Florencio
271	
272	View template details
273	Browse Webhook node documentation integration templates, or search all templates
274	Common issues#
275	
276	For common questions or issues and suggested solutions, refer to Common issues.
277	
278	Chat with the docs
279	This page was
280	Helpful
281	Not helpful
282	 Back to top
283	Previous
284	Wait
285	Next
286	Workflow development
287	Made with Material for MkDocs Insiders
Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.code_.md
Latest content with line numbers:
1	# Code node documentation | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/
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
29	Keyboard shortcuts
30	Common issues
31	Compare Datasets
32	Compression
33	Chat Trigger
34	Convert to File
35	Crypto
36	Data table
37	Date & Time
38	Debug Helper
39	Edit Fields (Set)
40	Edit Image
41	Email Trigger (IMAP)
42	Error Trigger
43	Evaluation
44	Evaluation Trigger
45	Execute Command
46	Execute Sub-workflow
47	Execute Sub-workflow Trigger
48	Execution Data
49	Extract From File
50	Filter
51	FTP
52	Git
53	GraphQL
54	HTML
55	HTTP Request
56	If
57	JWT
58	LDAP
59	Limit
60	Local File Trigger
61	Loop Over Items (Split in Batches)
62	Manual Trigger
63	Markdown
64	MCP Server Trigger
65	Merge
66	n8n
67	n8n Form
68	n8n Form Trigger
69	n8n Trigger
70	No Operation, do nothing
71	Read/Write Files from Disk
72	Remove Duplicates
73	Rename Keys
74	Respond to Chat
75	Respond to Webhook
76	RSS Read
77	RSS Feed Trigger
78	Schedule Trigger
79	Send Email
80	Sort
81	Split Out
82	SSE Trigger
83	SSH
84	Stop And Error
85	Summarize
86	Switch
87	TOTP
88	Wait
89	Webhook
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
112	Usage
113	Choose a mode
114	JavaScript
115	Supported JavaScript features
116	External libraries
117	Built-in methods and variables
118	Keyboard shortcuts
119	Python (Pyodide - legacy)
120	Built-in methods and variables
121	Keyboard shortcuts
122	File system and HTTP requests
123	Python (Native - beta)
124	Coding in n8n
125	Key concepts
126	Built-in methods and variables
127	Use AI in the Code node
128	Common issues
129	Integrations
130	Built-in nodes
131	Core nodes
132	Code
133	Code node#
134	
135	Use the Code node to write custom JavaScript or Python and run it as a step in your workflow.
136	
137	Coding in n8n
138	
139	This page gives usage information about the Code node. For more guidance on coding in n8n, refer to the Code section. It includes:
140	
141	Reference documentation on Built-in methods and variables
142	Guidance on Handling dates and Querying JSON
143	A growing collection of examples in the Cookbook
144	
145	Examples and templates
146	
147	For usage examples and templates to help you get started, refer to n8n's Code integrations page.
148	
149	Function and Function Item nodes
150	
151	The Code node replaces the Function and Function Item nodes from version 0.198.0. If you're using an older version of n8n, you can still view the Function node documentation and Function Item node documentation.
152	
153	Usage#
154	
155	How to use the Code node.
156	
157	Choose a mode#
158	
159	There are two modes:
160	
161	Run Once for All Items: this is the default. When your workflow runs, the code in the code node executes once, regardless of how many input items there are.
162	Run Once for Each Item: choose this if you want your code to run for every input item.
163	JavaScript#
164	
165	The Code node supports Node.js.
166	
167	Supported JavaScript features#
168	
169	The Code node supports:
170	
171	Promises. Instead of returning the items directly, you can return a promise which resolves accordingly.
172	Writing to your browser console using console.log. This is useful for debugging and troubleshooting your workflows.
173	External libraries#
174	
175	If you self-host n8n, you can import and use built-in and external npm modules in the Code node. To learn how to enable external modules, refer to the Enable modules in Code node guide.
176	
177	If you use n8n Cloud, you can't import external npm modules. n8n makes two modules available for you:
178	
179	crypto Node.js module
180	moment npm package
181	Built-in methods and variables#
182	
183	n8n provides built-in methods and variables for working with data and accessing n8n data. Refer to Built-in methods and variables for more information.
184	
185	The syntax to use the built-in methods and variables is $variableName or $methodName(). Type $ in the Code node or expressions editor to see a list of suggested methods and variables.
186	
187	Keyboard shortcuts#
188	
189	The Code node editing environment supports time-saving and useful keyboard shortcuts for a range of operations from autocompletion to code-folding and using multiple-cursors. See the full list of keyboard shortcuts.
190	
191	Python (Pyodide - legacy)#
192	
193	Pyodide is a legacy feature. Future versions of n8n will no longer support this feature.
194	
195	n8n added Python support in version 1.0. It doesn't include a Python executable. Instead, n8n provides Python support using Pyodide, which is a port of CPython to WebAssembly. This limits the available Python packages to the Packages included with Pyodide. n8n downloads the package automatically the first time you use it.
196	
197	Slower than JavaScript
198	
199	The Code node takes longer to process Python than JavaScript. This is due to the extra compilation steps.
200	
201	Built-in methods and variables#
202	
203	n8n provides built-in methods and variables for working with data and accessing n8n data. Refer to Built-in methods and variables for more information.
204	
205	The syntax to use the built-in methods and variables is _variableName or _methodName(). Type _ in the Code node to see a list of suggested methods and variables.
206	
207	Keyboard shortcuts#
208	
209	The Code node editing environment supports time-saving and useful keyboard shortcuts for a range of operations from autocompletion to code-folding and using multiple-cursors. See the full list of keyboard shortcuts.
210	
211	File system and HTTP requests#
212	
213	You can't access the file system or make HTTP requests. Use the following nodes instead:
214	
215	Read/Write File From Disk
216	HTTP Request
217	Python (Native - beta)#
218	
219	n8n added native Python support using task runners (beta) in version 1.111.0.
220	
221	Main differences from Pyodide:
222	
223	Native Python supports only _items in all-items mode and _item in per-item mode. It doesn't support other n8n built-in methods and variables.
224	Native Python supports importing native Python modules from the standard library and from third-parties, if the n8nio/runners image includes them and explicitly allowlists them. See adding extra dependencies for task runners for more details.
225	Native Python denies insecure built-ins by default. See task runners environment variables for more details.
226	Unlike Pyodide, which accepts dot access notation, for example, item.json.myNewField, native Python only accepts bracket access notation, for example, item["json"]["my_new_field"]. There may be other minor syntax differences where Pyodide accepts constructs that aren't legal in native Python.
227	
228	Keep in mind upgrading to native Python is a breaking change, so you may need to adjust your Python scripts to use the native Python runner.
229	
230	This feature is in beta and is subject to change. As it becomes stable, n8n will roll it out progressively to n8n cloud users during 2025. Self-hosting users can try it out and provide feedback.
231	
232	Coding in n8n#
233	
234	There are two places where you can use code in n8n: the Code node and the expressions editor. When using either area, there are some key concepts you need to know, as well as some built-in methods and variables to help with common tasks.
235	
236	Key concepts#
237	
238	When working with the Code node, you need to understand the following concepts:
239	
240	Data structure: understand the data you receive in the Code node, and requirements for outputting data from the node.
241	Item linking: learn how data items work, and how to link to items from previous nodes. You need to handle item linking in your code when the number of input and output items doesn't match.
242	Built-in methods and variables#
243	
244	n8n includes built-in methods and variables. These provide support for:
245	
246	Accessing specific item data
247	Accessing data about workflows, executions, and your n8n environment
248	Convenience variables to help with data and time
249	
250	Refer to Built-in methods and variables for more information.
251	
252	Use AI in the Code node#
253	
254	Feature availability
255	
256	AI assistance in the Code node is available to Cloud users. It isn't available in self-hosted n8n.
257	
258	AI generated code overwrites your code
259	
260	If you've already written some code on the Code tab, the AI generated code will replace it. n8n recommends using AI as a starting point to create your initial code, then editing it as needed.
261	
262	To use ChatGPT to generate code in the Code node:
263	
264	In the Code node, set Language to JavaScript.
265	Select the Ask AI tab.
266	Write your query.
267	Select Generate Code. n8n sends your query to ChatGPT, then displays the result in the Code tab.
268	Common issues#
269	
270	For common questions or issues and suggested solutions, refer to Common Issues.
271	
272	Chat with the docs
273	This page was
274	Helpful
275	Not helpful
276	 Back to top
277	Previous
278	AI Transform
279	Next
280	Keyboard shortcuts
281	Made with Material for MkDocs Insiders
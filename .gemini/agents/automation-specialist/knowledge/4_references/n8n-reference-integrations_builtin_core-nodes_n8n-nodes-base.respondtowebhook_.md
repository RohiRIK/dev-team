Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.respondtowebhook_.md
Latest content with line numbers:
1	# Respond to Webhook | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/
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
88	Workflow Trigger
89	XML
90	Actions
91	Triggers
92	Cluster nodes
93	Credentials
94	Custom API actions for existing nodes
95	Handle rate limits
96	Community nodes
97	Installation and management
98	Risks
99	Blocklist
100	Using community nodes
101	Troubleshooting
102	Building community nodes
103	Creating nodes
104	Overview
105	Plan your node
106	Build your node
107	Test your node
108	Deploy your node
109	Table of contents
110	How to use Respond to Webhook
111	Node parameters
112	Respond With
113	Node options
114	How n8n secures HTML responses
115	Templates and examples
116	Workflow behavior
117	Output the response sent to the webhook
118	Return more than one data item (deprecated)
119	Integrations
120	Built-in nodes
121	Core nodes
122	Respond to Webhook#
123	
124	Use the Respond to Webhook node to control the response to incoming webhooks. This node works with the Webhook node.
125	
126	Runs once for the first data item
127	
128	The Respond to Webhook node runs once, using the first incoming data item. Refer to Return more than one data item for more information.
129	
130	How to use Respond to Webhook#
131	
132	To use the Respond to Webhook node:
133	
134	Add a Webhook node as the trigger node for the workflow.
135	In the Webhook node, set Respond to Using 'Respond to Webhook' node.
136	Add the Respond to Webhook node anywhere in your workflow. If you want it to return data from other nodes, place it after those nodes.
137	Node parameters#
138	
139	Configure the node behavior using these parameters.
140	
141	Respond With#
142	
143	Choose what data to send in the webhook response.
144	
145	All Incoming Items: Respond with all the JSON items from the input.
146	Binary File: Respond with a binary file defined in Response Data Source.
147	First Incoming Item: Respond with the first incoming item's JSON.
148	JSON: Respond with a JSON object defined in Response Body.
149	JWT Token: Respond with a JSON Web Token (JWT).
150	No Data: No response payload.
151	Redirect: Redirect to a URL set in Redirect URL.
152	Text: Respond with text set in Response Body. This sends HTML by default (Content-Type: text/html).
153	Node options#
154	
155	Select Add Option to view and set the options.
156	
157	Response Code: Set the response code to use.
158	Response Headers: Define the response headers to send.
159	Put Response in Field: Available when you respond with All Incoming Items or First Incoming Item. Set the field name for the field containing the response data.
160	Enable Streaming: When enabled, sends the data back to the user using streaming. Requires a trigger configured with the Response mode Streaming.
161	How n8n secures HTML responses#
162	
163	Starting with n8n version 1.103.0, n8n automatically wraps HTML responses to webhooks in <iframe> tags. This is a security mechanism to protect the instance users.
164	
165	This has the following implications:
166	
167	HTML renders in a sandboxed iframe instead of directly in the parent document.
168	JavaScript code that attempts to access the top-level window or local storage will fail.
169	Authentication headers aren't available in the sandboxed iframe (for example, basic auth). You need to use an alternative approach, like embedding a short-lived access token within the HTML.
170	Relative URLs (for example, <form action="/">) won't work. Use absolute URLs instead.
171	Templates and examples#
172	Creating an API endpoint
173	
174	by Jonathan
175	
176	View template details
177	Create a Branded AI-Powered Website Chatbot
178	
179	by Wayne Simpson
180	
181	View template details
182	⚡AI-Powered YouTube Video Summarization & Analysis
183	
184	by Joseph LePage
185	
186	View template details
187	Browse Respond to Webhook integration templates, or search all templates
188	Workflow behavior#
189	
190	When using the Respond to Webhook node, workflows behave as follows:
191	
192	The workflow finishes without executing the Respond to Webhook node: it returns a standard message with a 200 status.
193	The workflow errors before the first Respond to Webhook node executes: the workflow returns an error message with a 500 status.
194	A second Respond to Webhook node executes after the first one: the workflow ignores it.
195	A Respond to Webhook node executes but there was no webhook: the workflow ignores the Respond to Webhook node.
196	Output the response sent to the webhook#
197	
198	By default, the Respond to Webhook node has a single output branch that contains the node's input data.
199	
200	You can optionally enable a second output branch containing the response sent to the webhook. To enable this secondary output, open the Respond to Webhook node on the canvas and select the Settings tab. Activate the Enable Response Output Branch option.
201	
202	The node will now have two outputs:
203	
204	Input Data: The original output, passing on the node's input.
205	Response: The response object sent to the webhook.
206	Return more than one data item (deprecated)#
207	
208	Deprecated in 1.22.0
209	
210	n8n 1.22.0 added support for returning all data items using the All Incoming Items option. n8n recommends upgrading to the latest version of n8n, instead of using the workarounds described in this section.
211	
212	The Respond to Webhook node runs once, using the first incoming data item. This includes when using expressions. You can't force looping using the Loop node: the workflow will run, but the webhook response will still only contain the results of the first execution.
213	
214	If you need to return more than one data item, choose one of these options:
215	
216	Instead of using the Respond to Webhook node, use the When Last Node Finishes option in Respond in the Webhook node. Use this when you want to return the final data that the workflow outputs.
217	Use the Aggregate node to turn multiple items into a single item before passing the data to the Respond to Webhook node. Set Aggregate to All Item Data (Into a Single List).
218	Chat with the docs
219	This page was
220	Helpful
221	Not helpful
222	 Back to top
223	Previous
224	Respond to Chat
225	Next
226	RSS Read
227	Made with Material for MkDocs Insiders
Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.if_.md
Latest content with line numbers:
1	# If | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/
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
110	Add conditions
111	Combining conditions
112	Templates and examples
113	Branch execution with If and Merge nodes
114	Related resources
115	Available data type comparisons
116	String
117	Number
118	Date & Time
119	Boolean
120	Array
121	Object
122	Integrations
123	Built-in nodes
124	Core nodes
125	If#
126	
127	Use the If node to split a workflow conditionally based on comparison operations.
128	
129	Add conditions#
130	
131	Create comparison Conditions for your If node.
132	
133	Use the data type dropdown to select the data type and comparison operation type for your condition. For example, to filter for dates after a particular date, select Date & Time > is after.
134	The fields and values to enter into the condition change based on the data type and comparison you select. Refer to Available data type comparisons for a full list of all comparisons by data type.
135	
136	Select Add condition to create more conditions.
137	
138	Combining conditions#
139	
140	You can choose to keep data:
141	
142	When it meets all conditions: Create two or more conditions and select AND in the dropdown between them.
143	When it meets any of the conditions: Create two or more conditions and select OR in the dropdown between them.
144	Templates and examples#
145	AI agent that can scrape webpages
146	
147	by Eduard
148	
149	View template details
150	✨🤖Automate Multi-Platform Social Media Content Creation with AI
151	
152	by Joseph LePage
153	
154	View template details
155	Pulling data from services that n8n doesn’t have a pre-built integration for
156	
157	by Jonathan
158	
159	View template details
160	Browse If integration templates, or search all templates
161	Branch execution with If and Merge nodes#
162	
163	0.236.0 and below
164	
165	n8n removed this execution behavior in version 1.0. This section applies to workflows using the v0 (legacy) workflow execution order. By default, this is all workflows built before version 1.0. You can change the execution order in your workflow settings.
166	
167	If you add a Merge node to a workflow containing an If node, it can result in both output data streams of the If node executing.
168	
169	One data stream triggers the Merge node, which then goes and executes the other data stream.
170	
171	For example, in the screenshot below there's a workflow containing an Edit Fields node, If node, and Merge node. The standard If node behavior is to execute one data stream (in the screenshot, this is the true output). However, due to the Merge node, both data streams execute, despite the If node not sending any data down the false data stream.
172	
173	Related resources#
174	
175	Refer to Splitting with conditionals for more information on using conditionals to create complex logic in n8n.
176	
177	If you need more than two conditional outputs, use the Switch node.
178	
179	Available data type comparisons#
180	String#
181	
182	String data type supports these comparisons:
183	
184	exists
185	does not exist
186	is empty
187	is not empty
188	is equal to
189	is not equal to
190	contains
191	does not contain
192	starts with
193	does not start with
194	ends with
195	does not end with
196	matches regex
197	does not match regex
198	Number#
199	
200	Number data type supports these comparisons:
201	
202	exists
203	does not exist
204	is empty
205	is not empty
206	is equal to
207	is not equal to
208	is greater than
209	is less than
210	is greater than or equal to
211	is less than or equal to
212	Date & Time#
213	
214	Date & Time data type supports these comparisons:
215	
216	exists
217	does not exist
218	is empty
219	is not empty
220	is equal to
221	is not equal to
222	is after
223	is before
224	is after or equal to
225	is before or equal to
226	Boolean#
227	
228	Boolean data type supports these comparisons:
229	
230	exists
231	does not exist
232	is empty
233	is not empty
234	is true
235	is false
236	is equal to
237	is not equal to
238	Array#
239	
240	Array data type supports these comparisons:
241	
242	exists
243	does not exist
244	is empty
245	is not empty
246	contains
247	does not contain
248	length equal to
249	length not equal to
250	length greater than
251	length less than
252	length greater than or equal to
253	length less than or equal to
254	Object#
255	
256	Object data type supports these comparisons:
257	
258	exists
259	does not exist
260	is empty
261	is not empty
262	Chat with the docs
263	This page was
264	Helpful
265	Not helpful
266	 Back to top
267	Previous
268	Common issues
269	Next
270	JWT
271	Made with Material for MkDocs Insiders
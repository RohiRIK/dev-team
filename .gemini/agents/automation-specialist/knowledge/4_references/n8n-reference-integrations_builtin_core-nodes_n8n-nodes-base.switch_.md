Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.switch_.md
Latest content with line numbers:
1	# Switch | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/
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
110	Node parameters
111	Rules
112	Rule options
113	Expression
114	Templates and examples
115	Related resources
116	Available data type comparisons
117	String
118	Number
119	Date & Time
120	Boolean
121	Array
122	Object
123	Integrations
124	Built-in nodes
125	Core nodes
126	Switch#
127	
128	Use the Switch node to route a workflow conditionally based on comparison operations. It's similar to the IF node, but supports multiple output routes.
129	
130	Node parameters#
131	
132	Select the Mode the node should use:
133	
134	Rules: Select this mode to build a matching rule for each output.
135	Expression: Select this mode to write an expression to return the output index programmatically.
136	
137	Node configuration depends on the Mode you select.
138	
139	Rules#
140	
141	To configure the node with this operation, use these parameters:
142	
143	Create Routing Rules to define comparison conditions.
144	Use the data type dropdown to select the data type and comparison operation type for your condition. For example, to create a rules for dates after a particular date, select Date & Time > is after.
145	The fields and values to enter into the condition change based on the data type and comparison you select. Refer to Available data type comparisons for a full list of all comparisons by data type.
146	Rename Output: Turn this control on to rename the output field to put matching data into. Enter your desired Output Name.
147	
148	Select Add Routing Rule to add more rules.
149	
150	Rule options#
151	
152	You can further configure the node with this operation using these Options:
153	
154	Fallback Output: Choose how to route the workflow when an item doesn't match any of the rules or conditions.
155	None: Ignore the item. This is the default behavior.
156	Extra Output: Send items to an extra, separate output.
157	Output 0: Send items to the same output as those matching the first rule.
158	Ignore Case: Set whether to ignore letter case when evaluating conditions (turned on) or enforce letter case (turned off).
159	Less Strict Type Validation: Set whether you want n8n to attempt to convert value types based on the operator you choose (turned on) or not (turned off).
160	Send data to all matching outputs: Set whether to send data to all outputs meeting conditions (turned on) or whether to send the data to the first output matching the conditions (turned off).
161	Expression#
162	
163	To configure the node with this operation, use these parameters:
164	
165	Number of Outputs: Set how many outputs the node should have.
166	Output Index: Create an expression to calculate which input item should be routed to which output. The expression must return a number.
167	Templates and examples#
168	Building Your First WhatsApp Chatbot
169	
170	by Jimleuk
171	
172	View template details
173	Telegram AI Chatbot
174	
175	by Eduard
176	
177	View template details
178	Respond to WhatsApp Messages with AI Like a Pro!
179	
180	by Jimleuk
181	
182	View template details
183	Browse Switch integration templates, or search all templates
184	Related resources#
185	
186	Refer to Splitting with conditionals for more information on using conditionals to create complex logic in n8n.
187	
188	Available data type comparisons#
189	String#
190	
191	String data type supports these comparisons:
192	
193	exists
194	does not exist
195	is empty
196	is not empty
197	is equal to
198	is not equal to
199	contains
200	does not contain
201	starts with
202	does not start with
203	ends with
204	does not end with
205	matches regex
206	does not match regex
207	Number#
208	
209	Number data type supports these comparisons:
210	
211	exists
212	does not exist
213	is empty
214	is not empty
215	is equal to
216	is not equal to
217	is greater than
218	is less than
219	is greater than or equal to
220	is less than or equal to
221	Date & Time#
222	
223	Date & Time data type supports these comparisons:
224	
225	exists
226	does not exist
227	is empty
228	is not empty
229	is equal to
230	is not equal to
231	is after
232	is before
233	is after or equal to
234	is before or equal to
235	Boolean#
236	
237	Boolean data type supports these comparisons:
238	
239	exists
240	does not exist
241	is empty
242	is not empty
243	is true
244	is false
245	is equal to
246	is not equal to
247	Array#
248	
249	Array data type supports these comparisons:
250	
251	exists
252	does not exist
253	is empty
254	is not empty
255	contains
256	does not contain
257	length equal to
258	length not equal to
259	length greater than
260	length less than
261	length greater than or equal to
262	length less than or equal to
263	Object#
264	
265	Object data type supports these comparisons:
266	
267	exists
268	does not exist
269	is empty
270	is not empty
271	Chat with the docs
272	This page was
273	Helpful
274	Not helpful
275	 Back to top
276	Previous
277	Summarize
278	Next
279	TOTP
280	Made with Material for MkDocs Insiders
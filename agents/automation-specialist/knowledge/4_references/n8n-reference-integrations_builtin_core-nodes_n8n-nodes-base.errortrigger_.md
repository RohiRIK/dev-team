Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-base.errortrigger_.md
Latest content with line numbers:
1	# Error Trigger node documentation | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger/
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
110	Usage
111	Templates and examples
112	Related resources
113	Error data
114	Integrations
115	Built-in nodes
116	Core nodes
117	Error Trigger node#
118	
119	You can use the Error Trigger node to create error workflows. When another linked workflow fails, this node gets details about the failed workflow and the errors, and runs the error workflow.
120	
121	Usage#
122	Create a new workflow, with the Error Trigger as the first node.
123	Give the workflow a name, for example Error Handler.
124	Select Save.
125	In the workflow where you want to use this error workflow:
126	Select Options  > Settings.
127	In Error workflow, select the workflow you just created. For example, if you used the name Error Handler, select Error handler.
128	Select Save. Now, when this workflow errors, the related error workflow runs.
129	
130	Note the following:
131	
132	If a workflow uses the Error Trigger node, you don't have to activate the workflow.
133	If a workflow contains the Error Trigger node, by default, the workflow uses itself as the error workflow.
134	You can't test error workflows when running workflows manually. The Error Trigger only runs when an automatic workflow errors.
135	Templates and examples#
136	
137	Browse Error Trigger integration templates, or search all templates
138	
139	Related resources#
140	
141	You can use the Stop And Error node to send custom messages to the Error Trigger.
142	
143	Read more about Error workflows in n8n workflows.
144	
145	Error data#
146	
147	The default error data received by the Error Trigger is:
148	
149	 1
150	 2
151	 3
152	 4
153	 5
154	 6
155	 7
156	 8
157	 9
158	10
159	11
160	12
161	13
162	14
163	15
164	16
165	17
166	18
167	19
168	[
169		{
170			"execution": {
171				"id": "231",
172				"url": "https://n8n.example.com/execution/231",
173				"retryOf": "34",
174				"error": {
175					"message": "Example Error Message",
176					"stack": "Stacktrace"
177				},
178				"lastNodeExecuted": "Node With Error",
179				"mode": "manual"
180			},
181			"workflow": {
182				"id": "1",
183				"name": "Example Workflow"
184			}
185		}
186	]
187	
188	
189	All information is always present, except:
190	
191	execution.id: requires the execution to be saved in the database. Not present if the error is in the trigger node of the main workflow, as the workflow doesn't execute.
192	execution.url: requires the execution to be saved in the database. Not present if the error is in the trigger node of the main workflow, as the workflow doesn't execute.
193	execution.retryOf: only present when the execution is a retry of a failed execution.
194	
195	If the error is caused by the trigger node of the main workflow, rather than a later stage, the data sent to the error workflow is different. There's less information in execution{} and more in trigger{}:
196	
197	 1
198	 2
199	 3
200	 4
201	 5
202	 6
203	 7
204	 8
205	 9
206	10
207	11
208	12
209	13
210	14
211	15
212	16
213	17
214	18
215	19
216	20
217	21
218	22
219	{
220	  "trigger": {
221	    "error": {
222	      "context": {},
223	      "name": "WorkflowActivationError",
224	      "cause": {
225	        "message": "",
226	        "stack": ""
227	      },
228	      "timestamp": 1654609328787,
229	      "message": "",
230	      "node": {
231	        . . . 
232	      }
233	    },
234	    "mode": "trigger"
235	  },
236	  "workflow": {
237	    "id": "",
238	    "name": ""
239	  }
240	}
241	
242	Chat with the docs
243	This page was
244	Helpful
245	Not helpful
246	 Back to top
247	Previous
248	Email Trigger (IMAP)
249	Next
250	Evaluation
251	Made with Material for MkDocs Insiders
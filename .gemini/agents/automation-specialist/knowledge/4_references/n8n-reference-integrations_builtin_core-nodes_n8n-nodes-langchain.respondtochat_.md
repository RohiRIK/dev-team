Text file: docs.n8n.io_integrations_builtin_core-nodes_n8n-nodes-langchain.respondtochat_.md
Latest content with line numbers:
1	# Respond to Chat node documentation | n8n Docs
2	
3	**URL:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.respondtochat/
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
111	Message
112	Wait for User Reply
113	Node options
114	Add Memory Input Connection
115	Limit Wait Time
116	Related resources
117	Common issues
118	Integrations
119	Built-in nodes
120	Core nodes
121	Respond to Chat node#
122	
123	Use the Respond to Chat node in correspondence with the Chat Trigger node to send a response into the chat and optionally wait for a response from the user. This allows you to have multiple chat interactions within a single execution and enables human-in-the-loop use cases in the chat.
124	
125	Chat Trigger node
126	
127	The Respond to Chat node requires a Chat Trigger node to be present in the workflow, with the Response Mode set to 'Using Response Nodes'.
128	
129	Node parameters#
130	Message#
131	
132	The message to send to the chat.
133	
134	Wait for User Reply#
135	
136	Set whether the workflow execution should wait for a response from the user (enabled) or continue immediately after sending the message (disabled).
137	
138	Node options#
139	Add Memory Input Connection#
140	
141	Choose whether you want to commit the messages from the Respond to Chat node to a connected memory. Using a shared memory between an agent or chain root node and the Respond to Chat node attaches the same session key to these messages and lets you capture the full message history.
142	
143	Limit Wait Time#
144	
145	When you enable Wait for User Reply, this option decides whether the workflow automatically resumes execution after a specific limit (enabled) or not (disabled).
146	
147	Related resources#
148	
149	View n8n's Advanced AI documentation.
150	
151	Common issues#
152	
153	For common questions or issues and suggested solutions, refer to Common Issues.
154	
155	Chat with the docs
156	This page was
157	Helpful
158	Not helpful
159	 Back to top
160	Previous
161	Rename Keys
162	Next
163	Respond to Webhook
164	Made with Material for MkDocs Insiders
# ML Engineer Cheat Sheet

This cheat sheet provides a quick reference for key concepts, algorithms, and best practices for Machine Learning Engineers.

## I. Machine Learning Fundamentals

-   **Types of Learning:**
    -   **Supervised Learning:** Learns from labeled data (e.g., Classification, Regression).
    -   **Unsupervised Learning:** Finds patterns in unlabeled data (e.g., Clustering, Dimensionality Reduction).
    -   **Reinforcement Learning:** Agent learns by interacting with an environment to maximize reward.
-   **Key Concepts:**
    -   **Overfitting:** Model performs well on training data but poorly on new data.
    -   **Underfitting:** Model is too simple to capture underlying patterns.
    -   **Bias-Variance Tradeoff:** Balancing model complexity to minimize both bias (error from erroneous assumptions) and variance (error from sensitivity to training data).
    -   **Regularization:** Techniques to prevent overfitting (e.g., L1, L2, Dropout).

## II. Core Machine Learning Algorithms

-   **Supervised:**
    -   **Linear Regression:** Predicts continuous values.
    -   **Logistic Regression:** Predicts binary outcomes.
    -   **Decision Trees:** Tree-like model for classification and regression.
    -   **Random Forest:** Ensemble of decision trees.
    -   **Support Vector Machines (SVM):** Finds optimal hyperplane for classification.
-   **Unsupervised:**
    -   **K-Means Clustering:** Groups data into K clusters.
    -   **Principal Component Analysis (PCA):** Dimensionality reduction technique.

## III. Deep Learning Concepts

-   **Neural Networks:** Composed of layers of interconnected nodes.
-   **Activation Functions:** Introduce non-linearity (e.g., ReLU, Sigmoid, Tanh).
-   **Backpropagation:** Algorithm for training neural networks.
-   **CNNs (Convolutional Neural Networks):** Excellent for image data.
-   **RNNs (Recurrent Neural Networks):** Good for sequential data (e.g., LSTMs, GRUs).
-   **GANs (Generative Adversarial Networks):** Generative models for creating new data.
-   **Frameworks:** TensorFlow, PyTorch.

## IV. Machine Learning Pipeline

1.  **Problem Definition:** Clearly define the business problem and ML task.
2.  **Data Collection:** Gather relevant and high-quality data.
3.  **Data Preprocessing:** Clean, transform, and prepare data.
4.  **Feature Engineering:** Create new features to improve model performance.
5.  **Model Selection:** Choose appropriate algorithms.
6.  **Cross-Validation:** Robustly evaluate model performance.
7.  **Hyperparameter Tuning:** Optimize model parameters.
8.  **Model Evaluation:** Assess model performance using relevant metrics.
9.  **Model Interpretability:** Understand *why* a model makes predictions.
10. **Deployment:** Integrate model into production.

## V. Evaluation Metrics

-   **Classification:**
    -   **Accuracy:** (TP + TN) / (TP + TN + FP + FN)
    -   **Precision:** TP / (TP + FP)
    -   **Recall (Sensitivity):** TP / (TP + FN)
    -   **F1-Score:** 2 * (Precision * Recall) / (Precision + Recall)
    -   **Confusion Matrix:** Visualizes TP, TN, FP, FN.
    -   **AUC-ROC Curve:** Evaluates binary classification performance across thresholds.
-   **Regression:**
    -   **Mean Squared Error (MSE):** Average of squared errors.
    -   **Mean Absolute Error (MAE):** Average of absolute errors.
    -   **R-squared:** Proportion of variance explained.

## VI. Tools and Technologies

-   **Programming Languages:** Python.
-   **Version Control:** Git.
-   **Databases:** SQL.
-   **ML Libraries:** Scikit-learn, NumPy, Pandas, Matplotlib, Seaborn.
-   **Deep Learning Frameworks:** TensorFlow, PyTorch.
-   **MLOps Tools:** MLflow, DVC, Kubeflow.
-   **Cloud Platforms:** AWS, GCP, Azure.
-   **Containerization:** Docker, Kubernetes.

## VII. MLOps Principles

-   **Automation:** Automate ML pipeline stages.
-   **Versioning:** Track all ML assets (code, data, models, configs).
-   **CI/CD/CT/CM:** Continuous Integration, Delivery, Training, Monitoring.
-   **Reproducibility:** Ability to recreate results.
-   **Testing:** Comprehensive testing (data, code, model).
-   **Monitoring:** Track model performance and data quality in production.
-   **Collaboration:** Seamless teamwork across roles.
-   **Governance & Security:** Data privacy, access control, compliance.

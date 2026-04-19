# AI Mapping Copilot

**AI Mapping Copilot** is a high-performance, AI-driven web application designed to streamline insurance data operations. It automates the complex task of mapping disparate spreadsheet column headers to a standardized canonical schema, ensuring data integrity and operational speed.

## 🚀 Features

-   **Intelligent Auto-Mapping**: Leverages Google Gemini 2.0 Flash to perform semantic similarity analysis on spreadsheet headers.
-   **Local File Ingestion**: Robust drag-and-drop support for `.csv` and `.xlsx` files with client-side parsing.
-   **Operator Summary Dashboard**: High-level metrics for total columns, successful mappings, unmapped fields, and schema conflicts.
-   **Human-in-the-Loop Review**: An interactive mapping table allowing operators to verify, override, or ignore AI suggestions.
-   **One-Click Export**: Finalized mapping configurations can be exported directly as a timestamped JSON file.
-   **Clean & Minimal Design**: Built using Shadcn UI and Inter typography for a focused, "built-for-work" experience.

## 🛠️ Technology Stack

-   **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS.
-   **UI Components**: Shadcn UI (Radix UI), Lucide Icons.
-   **AI Engine**: Google Generative AI (Gemini 2.0 Flash).
-   **File Parsing**: PapaParse (CSV), XLSX.js (Excel).

## 📥 Getting Started

### Prerequisites

-   Node.js (v20+)
-   A Google Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/thegr8binil/uniblox-test.git
    cd uniblox-test
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📖 How It Works

1.  **Upload**: Drag and drop an insurance spreadsheet into the ingestion zone.
2.  **Extraction**: The system extracts the header row locally without uploading your private data to a server.
3.  **AI Mapping**: The headers are sent to the AI Mapping API, which compares them against the canonical insurance schema:
    - `employee_id`, `first_name`, `last_name`, `date_of_birth`, `state`, `zip`, `annual_salary`, `hire_date`, `employment_status`, `coverage_amount`, `smoker`, `dependent_count`.
4.  **Verification**: Operators review the suggested mappings. Rows with low confidence (<50%) or null mappings are highlighted for attention.
5.  **Export**: Once reviewed, click **Approve & Export JSON** to download the finalized mapping configuration.

---
Built with ⚡ by the UNIBLOX team.

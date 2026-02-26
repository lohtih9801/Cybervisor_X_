const attackMatrixData = [

  /* ================= INITIAL ACCESS ================= */

  {
    tactic: "Initial Access",
    techniques: [
      {
        id: "T1566",
        name: "Phishing",
        risk: "High",
        description:
          "Fraudulent emails or messages used to trick users into revealing credentials or executing malicious payloads.",
        detection:
          "Email anomaly detection, DMARC/SPF failures, suspicious attachments.",
        mitigation:
          "User awareness training, MFA enforcement, secure email gateways.",
        scenario:
          "Spoofed invoice email capturing Microsoft 365 credentials.",
        activityCount: 12
      },
      {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        risk: "Critical",
        description:
          "Exploitation of vulnerabilities in internet-facing services or web applications.",
        detection:
          "WAF logs, abnormal HTTP patterns, repeated server errors.",
        mitigation:
          "Patch management, secure coding, web application firewall.",
        scenario:
          "SQL injection on outdated CMS leading to database compromise.",
        activityCount: 7
      }
    ]
  },

  /* ================= EXECUTION ================= */

  {
    tactic: "Execution",
    techniques: [
      {
        id: "T1059",
        name: "Command & Scripting Interpreter",
        risk: "Medium",
        description:
          "Abuse of PowerShell, Bash, CMD or scripting engines to execute malicious scripts.",
        detection:
          "Suspicious command-line parameters and encoded scripts.",
        mitigation:
          "Restrict scripting engines and implement application control.",
        scenario:
          "PowerShell reverse shell executed post phishing compromise.",
        activityCount: 5
      },
      {
        id: "T1674",
        name: "Input Injection",
        risk: "High",
        description:
          "Simulated keystrokes or HID-based input to execute malicious commands or scripts.",
        detection:
          "USB HID enumeration, rapid keystroke injection without user interaction.",
        mitigation:
          "Restrict USB devices, execution prevention policies.",
        scenario:
          "Malicious USB device launching PowerShell to download malware.",
        activityCount: 3
      }
    ]
  },

  /* ================= DEFENSE EVASION ================= */

  {
    tactic: "Defense Evasion",
    techniques: [
      {
        id: "T1220",
        name: "XSL Script Processing",
        risk: "High",
        description:
          "Execution of embedded malicious scripts inside XSL files using msxsl.exe or wmic.",
        detection:
          "Process execution of msxsl.exe or wmic with suspicious /FORMAT switch.",
        mitigation:
          "Block msxsl.exe if unused, restrict WMI execution.",
        scenario:
          "Remote XSL file executing embedded JScript payload.",
        activityCount: 4
      }
    ]
  },

  /* ================= CREDENTIAL ACCESS ================= */

  {
    tactic: "Credential Access",
    techniques: [
      {
        id: "T1110",
        name: "Brute Force",
        risk: "High",
        description:
          "Systematic guessing of passwords to gain unauthorized access.",
        detection:
          "Multiple failed login attempts across accounts.",
        mitigation:
          "Account lockout policies, MFA enforcement.",
        scenario:
          "Password spraying against Office 365 accounts.",
        activityCount: 8,
        subTechniques: [
          { id: "T1110.001", name: "Password Guessing" },
          { id: "T1110.002", name: "Password Cracking" },
          { id: "T1110.003", name: "Password Spraying" },
          { id: "T1110.004", name: "Credential Stuffing" }
        ]
      },
      {
        id: "T1003",
        name: "OS Credential Dumping",
        risk: "Critical",
        description:
          "Extraction of credential material from memory, SAM, NTDS, or LSASS.",
        detection:
          "LSASS memory access, suspicious registry hive access.",
        mitigation:
          "Credential Guard, restrict admin privileges.",
        scenario:
          "Mimikatz dumping NTLM hashes from LSASS.",
        activityCount: 9,
        subTechniques: [
          { id: "T1003.001", name: "LSASS Memory" },
          { id: "T1003.002", name: "SAM Database" },
          { id: "T1003.003", name: "NTDS.dit" },
          { id: "T1003.004", name: "LSA Secrets" }
        ]
      },
      {
        id: "T1555",
        name: "Credentials from Password Stores",
        risk: "High",
        description:
          "Extraction of stored credentials from browsers, keychains, or password managers.",
        detection:
          "Access to browser credential stores or vault files.",
        mitigation:
          "Encrypt password vaults and restrict access.",
        scenario:
          "Malware extracting Chrome saved credentials.",
        activityCount: 6
      },
      {
        id: "T1040",
        name: "Network Sniffing",
        risk: "Medium",
        description:
          "Monitoring network traffic to capture credentials in transit.",
        detection:
          "Promiscuous mode network adapters and abnormal packet capture.",
        mitigation:
          "Encrypted communications (TLS), network segmentation.",
        scenario:
          "Capturing plaintext FTP credentials.",
        activityCount: 4
      },
      {
        id: "T1056",
        name: "Input Capture",
        risk: "High",
        description:
          "Capturing user input such as keystrokes or GUI prompts to collect credentials.",
        detection:
          "API hooking detection, abnormal input capture libraries.",
        mitigation:
          "Endpoint protection and user privilege restrictions.",
        scenario:
          "Keylogger intercepting user login credentials.",
        activityCount: 5
      },
      {
        id: "T1556",
        name: "Modify Authentication Process",
        risk: "Critical",
        description:
          "Tampering with authentication systems to gain persistent access.",
        detection:
          "Unauthorized modification of LSASS, PAM, or authentication DLLs.",
        mitigation:
          "System integrity monitoring and access control policies.",
        scenario:
          "Malicious password filter DLL capturing domain credentials.",
        activityCount: 3
      },
      {
        id: "T1558",
        name: "Steal or Forge Kerberos Tickets",
        risk: "Critical",
        description:
          "Abusing Kerberos authentication through Golden or Silver Tickets.",
        detection:
          "Abnormal TGT/TGS ticket behavior.",
        mitigation:
          "KRBTGT password rotation, monitoring ticket lifetimes.",
        scenario:
          "Golden Ticket granting full domain admin privileges.",
        activityCount: 4
      }
    ]
  },

  /* ================= IMPACT ================= */

  {
    tactic: "Impact",
    techniques: [
      {
        id: "T1565",
        name: "Data Manipulation",
        risk: "Critical",
        description:
          "Insertion, deletion, or manipulation of stored, transmitted, or runtime data to influence business processes or hide activity.",
        detection:
          "Unauthorized file modifications, anomalous metadata changes, abnormal database updates.",
        mitigation:
          "Encrypt sensitive information, network segmentation, secure backups, restrict file permissions.",
        scenario:
          "Fraudulent transactions injected to mimic legitimate behavior.",
        activityCount: 6,
        subTechniques: [
          { id: "T1565.001", name: "Stored Data Manipulation" },
          { id: "T1565.002", name: "Transmitted Data Manipulation" },
          { id: "T1565.003", name: "Runtime Data Manipulation" }
        ]
      },
      {
        id: "T1565.002",
        name: "Transmitted Data Manipulation",
        risk: "High",
        description:
          "Altering data in transit to manipulate business outcomes or hide activity.",
        detection:
          "Mismatched file hashes, abnormal API interception, TLS downgrade attempts.",
        mitigation:
          "Encrypt all data flows and enforce secure transmission protocols.",
        scenario:
          "SWIFT message manipulation during network transmission.",
        activityCount: 3
      },
      {
        id: "T1565.003",
        name: "Runtime Data Manipulation",
        risk: "High",
        description:
          "Modifying application behavior or binaries to manipulate displayed data.",
        detection:
          "Binary integrity mismatches, suspicious API hooking.",
        mitigation:
          "Restrict file permissions and enforce system integrity monitoring.",
        scenario:
          "Manipulating financial PDF data before display to users.",
        activityCount: 2
      }
    ]
  }

];

export default attackMatrixData;
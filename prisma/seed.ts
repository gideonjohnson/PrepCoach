import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ==========================================
  // CODING PROBLEMS
  // ==========================================

  const codingProblems = [
    // --- EASY ---
    {
      slug: 'two-sum',
      title: 'Two Sum',
      description:
        'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficulty: 'easy',
      category: 'Arrays',
      companies: JSON.stringify(['Google', 'Amazon', 'Meta', 'Apple']),
      tags: JSON.stringify(['array', 'hash-table']),
      constraints: JSON.stringify([
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.',
      ]),
      examples: JSON.stringify([
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6' },
      ]),
      hints: JSON.stringify([
        'Think about what value you need to find for each element.',
        'A hash map can help you look up complements in O(1).',
        'For each element, check if target - element exists in the map.',
        'Store each number and its index as you iterate.',
      ]),
      testCases: JSON.stringify([
        { input: '{"nums":[2,7,11,15],"target":9}', expectedOutput: '[0,1]', isHidden: false },
        { input: '{"nums":[3,2,4],"target":6}', expectedOutput: '[1,2]', isHidden: false },
        { input: '{"nums":[3,3],"target":6}', expectedOutput: '[0,1]', isHidden: false },
        { input: '{"nums":[1,5,8,3],"target":4}', expectedOutput: '[0,3]', isHidden: true },
        { input: '{"nums":[-1,0,1,2],"target":1}', expectedOutput: '[0,2]', isHidden: true },
      ]),
      solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}`,
      solutionExplanation: 'Use a hash map to store each number and its index. For each element, check if the complement (target - current) already exists in the map.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    {
      slug: 'valid-parentheses',
      title: 'Valid Parentheses',
      description:
        'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.',
      difficulty: 'easy',
      category: 'Strings',
      companies: JSON.stringify(['Amazon', 'Meta', 'Microsoft']),
      tags: JSON.stringify(['stack', 'string']),
      constraints: JSON.stringify(['1 <= s.length <= 10^4', 's consists of parentheses only.']),
      examples: JSON.stringify([
        { input: 's = "()"', output: 'true', explanation: 'Simple matching pair.' },
        { input: 's = "()[]{}"', output: 'true', explanation: 'All pairs match.' },
        { input: 's = "(]"', output: 'false', explanation: 'Mismatched brackets.' },
      ]),
      hints: JSON.stringify([
        'Think about what data structure maintains order of opening brackets.',
        'A stack is perfect for matching pairs.',
        'Push opening brackets, pop and compare for closing brackets.',
        'At the end, the stack should be empty for a valid string.',
      ]),
      testCases: JSON.stringify([
        { input: '{"s":"()"}', expectedOutput: 'true', isHidden: false },
        { input: '{"s":"()[]{}"}', expectedOutput: 'true', isHidden: false },
        { input: '{"s":"(]"}', expectedOutput: 'false', isHidden: false },
        { input: '{"s":"([)]"}', expectedOutput: 'false', isHidden: true },
        { input: '{"s":"{[]}"}', expectedOutput: 'true', isHidden: true },
      ]),
      solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if ('({['.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}`,
      solutionExplanation: 'Use a stack. Push opening brackets. For each closing bracket, pop and verify it matches.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    {
      slug: 'merge-two-sorted-lists',
      title: 'Merge Two Sorted Lists',
      description:
        'You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes. Return the head of the merged linked list.',
      difficulty: 'easy',
      category: 'Linked Lists',
      companies: JSON.stringify(['Amazon', 'Microsoft', 'Apple']),
      tags: JSON.stringify(['linked-list', 'recursion']),
      constraints: JSON.stringify([
        'The number of nodes in both lists is in the range [0, 50].',
        '-100 <= Node.val <= 100',
        'Both lists are sorted in non-decreasing order.',
      ]),
      examples: JSON.stringify([
        { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merged in sorted order.' },
        { input: 'list1 = [], list2 = []', output: '[]', explanation: 'Both empty.' },
      ]),
      hints: JSON.stringify([
        'Compare the first elements of both lists.',
        'Use a dummy head node to simplify the logic.',
        'Iterate while both lists have nodes, always picking the smaller.',
        'Append the remaining list at the end.',
      ]),
      testCases: JSON.stringify([
        { input: '{"list1":[1,2,4],"list2":[1,3,4]}', expectedOutput: '[1,1,2,3,4,4]', isHidden: false },
        { input: '{"list1":[],"list2":[]}', expectedOutput: '[]', isHidden: false },
        { input: '{"list1":[],"list2":[0]}', expectedOutput: '[0]', isHidden: true },
      ]),
      solution: `function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let curr = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { curr.next = list1; list1 = list1.next; }
    else { curr.next = list2; list2 = list2.next; }
    curr = curr.next;
  }
  curr.next = list1 || list2;
  return dummy.next;
}`,
      solutionExplanation: 'Use a dummy node and merge by comparing heads of both lists.',
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'maximum-subarray',
      title: 'Maximum Subarray',
      description:
        'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
      difficulty: 'easy',
      category: 'Arrays',
      companies: JSON.stringify(['Amazon', 'Microsoft', 'Google', 'Apple']),
      tags: JSON.stringify(['array', 'dynamic-programming', 'divide-and-conquer']),
      constraints: JSON.stringify(['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4']),
      examples: JSON.stringify([
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
        { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
        { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The entire array is the max subarray.' },
      ]),
      hints: JSON.stringify([
        'Consider Kadane\'s algorithm.',
        'At each position, decide: extend the previous subarray or start a new one.',
        'Track the current sum and the maximum sum seen so far.',
        'If the current sum becomes negative, reset it to 0.',
      ]),
      testCases: JSON.stringify([
        { input: '{"nums":[-2,1,-3,4,-1,2,1,-5,4]}', expectedOutput: '6', isHidden: false },
        { input: '{"nums":[1]}', expectedOutput: '1', isHidden: false },
        { input: '{"nums":[5,4,-1,7,8]}', expectedOutput: '23', isHidden: false },
        { input: '{"nums":[-1]}', expectedOutput: '-1', isHidden: true },
        { input: '{"nums":[-2,-1]}', expectedOutput: '-1', isHidden: true },
      ]),
      solution: `function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      solutionExplanation: 'Kadane\'s algorithm: track the running sum, reset when it goes below the current element.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'best-time-to-buy-and-sell-stock',
      title: 'Best Time to Buy and Sell Stock',
      description:
        'You are given an array `prices` where `prices[i]` is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy and a single day to sell. Return the maximum profit. If no profit is possible, return 0.',
      difficulty: 'easy',
      category: 'Arrays',
      companies: JSON.stringify(['Amazon', 'Meta', 'Google', 'Goldman Sachs']),
      tags: JSON.stringify(['array', 'greedy']),
      constraints: JSON.stringify(['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4']),
      examples: JSON.stringify([
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit = 5.' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction possible.' },
      ]),
      hints: JSON.stringify([
        'Track the minimum price seen so far.',
        'At each day, calculate the profit if you sold today.',
        'Update the maximum profit accordingly.',
        'One pass through the array is sufficient.',
      ]),
      testCases: JSON.stringify([
        { input: '{"prices":[7,1,5,3,6,4]}', expectedOutput: '5', isHidden: false },
        { input: '{"prices":[7,6,4,3,1]}', expectedOutput: '0', isHidden: false },
        { input: '{"prices":[2,4,1]}', expectedOutput: '2', isHidden: true },
        { input: '{"prices":[1]}', expectedOutput: '0', isHidden: true },
      ]),
      solution: `function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
      solutionExplanation: 'Track the minimum price and compute potential profit at each step.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },

    // --- MEDIUM ---
    {
      slug: 'longest-substring-without-repeating',
      title: 'Longest Substring Without Repeating Characters',
      description:
        'Given a string `s`, find the length of the longest substring without repeating characters.',
      difficulty: 'medium',
      category: 'Strings',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple']),
      tags: JSON.stringify(['string', 'sliding-window', 'hash-table']),
      constraints: JSON.stringify([
        '0 <= s.length <= 5 * 10^4',
        's consists of English letters, digits, symbols and spaces.',
      ]),
      examples: JSON.stringify([
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1.' },
        { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3.' },
      ]),
      hints: JSON.stringify([
        'Use a sliding window approach.',
        'Track the characters in the current window with a set or map.',
        'When you find a duplicate, shrink the window from the left.',
        'Use a map to store the last index of each character for O(1) window adjustment.',
      ]),
      testCases: JSON.stringify([
        { input: '{"s":"abcabcbb"}', expectedOutput: '3', isHidden: false },
        { input: '{"s":"bbbbb"}', expectedOutput: '1', isHidden: false },
        { input: '{"s":"pwwkew"}', expectedOutput: '3', isHidden: false },
        { input: '{"s":""}', expectedOutput: '0', isHidden: true },
        { input: '{"s":"dvdf"}', expectedOutput: '3', isHidden: true },
      ]),
      solution: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) left = Math.max(left, map.get(s[right]) + 1);
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      solutionExplanation: 'Sliding window with a hash map tracking last seen index of each character.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(m, n))',
    },
    {
      slug: 'three-sum',
      title: '3Sum',
      description:
        'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.',
      difficulty: 'medium',
      category: 'Arrays',
      companies: JSON.stringify(['Meta', 'Amazon', 'Google', 'Microsoft']),
      tags: JSON.stringify(['array', 'two-pointers', 'sorting']),
      constraints: JSON.stringify(['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5']),
      examples: JSON.stringify([
        { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Two triplets sum to 0.' },
        { input: 'nums = [0,1,1]', output: '[]', explanation: 'No triplet sums to 0.' },
        { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explanation: 'Only one valid triplet.' },
      ]),
      hints: JSON.stringify([
        'Sort the array first to enable the two-pointer technique.',
        'Fix one element and use two pointers for the remaining pair.',
        'Skip duplicates to avoid duplicate triplets.',
        'If the fixed element is positive, you can stop early.',
      ]),
      testCases: JSON.stringify([
        { input: '{"nums":[-1,0,1,2,-1,-4]}', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false },
        { input: '{"nums":[0,1,1]}', expectedOutput: '[]', isHidden: false },
        { input: '{"nums":[0,0,0]}', expectedOutput: '[[0,0,0]]', isHidden: false },
        { input: '{"nums":[-2,0,1,1,2]}', expectedOutput: '[[-2,0,2],[-2,1,1]]', isHidden: true },
      ]),
      solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        result.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return result;
}`,
      solutionExplanation: 'Sort + fix one element + two pointers. Skip duplicates.',
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'binary-tree-level-order-traversal',
      title: 'Binary Tree Level Order Traversal',
      description:
        'Given the `root` of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
      difficulty: 'medium',
      category: 'Trees',
      companies: JSON.stringify(['Amazon', 'Meta', 'Microsoft']),
      tags: JSON.stringify(['tree', 'bfs', 'queue']),
      constraints: JSON.stringify([
        'The number of nodes in the tree is in the range [0, 2000].',
        '-1000 <= Node.val <= 1000',
      ]),
      examples: JSON.stringify([
        { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'Three levels in the tree.' },
        { input: 'root = [1]', output: '[[1]]', explanation: 'Single node.' },
        { input: 'root = []', output: '[]', explanation: 'Empty tree.' },
      ]),
      hints: JSON.stringify([
        'Use BFS (Breadth-First Search).',
        'A queue helps process nodes level by level.',
        'Track the size of each level before processing.',
        'Add all children of current level nodes to the queue.',
      ]),
      testCases: JSON.stringify([
        { input: '{"root":[3,9,20,null,null,15,7]}', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false },
        { input: '{"root":[1]}', expectedOutput: '[[1]]', isHidden: false },
        { input: '{"root":[]}', expectedOutput: '[]', isHidden: true },
      ]),
      solution: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
      solutionExplanation: 'BFS with a queue. Process all nodes at the current level before moving to the next.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
    {
      slug: 'coin-change',
      title: 'Coin Change',
      description:
        'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up, return -1.',
      difficulty: 'medium',
      category: 'Dynamic Programming',
      companies: JSON.stringify(['Amazon', 'Google', 'Apple', 'Bloomberg']),
      tags: JSON.stringify(['dp', 'bfs']),
      constraints: JSON.stringify([
        '1 <= coins.length <= 12',
        '1 <= coins[i] <= 2^31 - 1',
        '0 <= amount <= 10^4',
      ]),
      examples: JSON.stringify([
        { input: 'coins = [1,5,10], amount = 12', output: '3', explanation: '12 = 10 + 1 + 1' },
        { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 with only coin 2.' },
        { input: 'coins = [1], amount = 0', output: '0', explanation: 'Amount is 0, 0 coins needed.' },
      ]),
      hints: JSON.stringify([
        'Think of this as a DP problem.',
        'dp[i] = minimum coins to make amount i.',
        'For each coin, dp[i] = min(dp[i], dp[i - coin] + 1).',
        'Initialize dp array with Infinity, dp[0] = 0.',
      ]),
      testCases: JSON.stringify([
        { input: '{"coins":[1,5,10],"amount":12}', expectedOutput: '3', isHidden: false },
        { input: '{"coins":[2],"amount":3}', expectedOutput: '-1', isHidden: false },
        { input: '{"coins":[1],"amount":0}', expectedOutput: '0', isHidden: false },
        { input: '{"coins":[1,2,5],"amount":11}', expectedOutput: '3', isHidden: true },
        { input: '{"coins":[186,419,83,408],"amount":6249}', expectedOutput: '20', isHidden: true },
      ]),
      solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      solutionExplanation: 'Bottom-up DP. Build minimum coins for each amount from 0 to target.',
      timeComplexity: 'O(amount * coins.length)',
      spaceComplexity: 'O(amount)',
    },
    {
      slug: 'number-of-islands',
      title: 'Number of Islands',
      description:
        'Given an `m x n` 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
      difficulty: 'medium',
      category: 'Graphs',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Microsoft']),
      tags: JSON.stringify(['graph', 'dfs', 'bfs', 'matrix']),
      constraints: JSON.stringify([
        'm == grid.length',
        'n == grid[i].length',
        '1 <= m, n <= 300',
        'grid[i][j] is "0" or "1".',
      ]),
      examples: JSON.stringify([
        {
          input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
          output: '1',
          explanation: 'One connected island.',
        },
        {
          input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
          output: '3',
          explanation: 'Three separate islands.',
        },
      ]),
      hints: JSON.stringify([
        'Use DFS or BFS to explore connected land cells.',
        'Mark visited cells by changing "1" to "0".',
        'Each time you find an unvisited "1", increment the island count.',
        'Explore all 4 directions from each land cell.',
      ]),
      testCases: JSON.stringify([
        { input: '{"grid":[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}', expectedOutput: '1', isHidden: false },
        { input: '{"grid":[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}', expectedOutput: '3', isHidden: false },
        { input: '{"grid":[["1"],["0"]]}', expectedOutput: '1', isHidden: true },
      ]),
      solution: `function numIslands(grid) {
  let count = 0;
  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] === '0') return;
    grid[i][j] = '0';
    dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') { count++; dfs(i, j); }
    }
  }
  return count;
}`,
      solutionExplanation: 'DFS flood fill. Each new "1" starts a DFS that marks connected land as visited.',
      timeComplexity: 'O(m * n)',
      spaceComplexity: 'O(m * n)',
    },
    {
      slug: 'product-of-array-except-self',
      title: 'Product of Array Except Self',
      description:
        'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must solve it without using division and in O(n) time.',
      difficulty: 'medium',
      category: 'Arrays',
      companies: JSON.stringify(['Amazon', 'Meta', 'Apple', 'Microsoft']),
      tags: JSON.stringify(['array', 'prefix-product']),
      constraints: JSON.stringify([
        '2 <= nums.length <= 10^5',
        '-30 <= nums[i] <= 30',
        'The product of any prefix or suffix fits in a 32-bit integer.',
      ]),
      examples: JSON.stringify([
        { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'Each element is product of all others.' },
        { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Zero makes all but itself 0.' },
      ]),
      hints: JSON.stringify([
        'Think about prefix and suffix products.',
        'First pass: compute prefix products (left to right).',
        'Second pass: multiply by suffix products (right to left).',
        'You can do this in-place with O(1) extra space.',
      ]),
      testCases: JSON.stringify([
        { input: '{"nums":[1,2,3,4]}', expectedOutput: '[24,12,8,6]', isHidden: false },
        { input: '{"nums":[-1,1,0,-3,3]}', expectedOutput: '[0,0,9,0,0]', isHidden: false },
        { input: '{"nums":[2,3]}', expectedOutput: '[3,2]', isHidden: true },
      ]),
      solution: `function productExceptSelf(nums) {
  const n = nums.length, answer = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) { answer[i] = prefix; prefix *= nums[i]; }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) { answer[i] *= suffix; suffix *= nums[i]; }
  return answer;
}`,
      solutionExplanation: 'Two passes: prefix products left-to-right, then suffix products right-to-left.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'validate-binary-search-tree',
      title: 'Validate Binary Search Tree',
      description:
        'Given the `root` of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has left subtree values strictly less than the node, and right subtree values strictly greater.',
      difficulty: 'medium',
      category: 'Trees',
      companies: JSON.stringify(['Amazon', 'Meta', 'Microsoft']),
      tags: JSON.stringify(['tree', 'dfs', 'bst']),
      constraints: JSON.stringify([
        'The number of nodes is in [1, 10^4].',
        '-2^31 <= Node.val <= 2^31 - 1',
      ]),
      examples: JSON.stringify([
        { input: 'root = [2,1,3]', output: 'true', explanation: 'Valid BST.' },
        { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'Right child 4 < root 5.' },
      ]),
      hints: JSON.stringify([
        'Each node must satisfy a range constraint.',
        'Pass min and max bounds during recursion.',
        'Left child must be less than current node.',
        'Right child must be greater than current node.',
      ]),
      testCases: JSON.stringify([
        { input: '{"root":[2,1,3]}', expectedOutput: 'true', isHidden: false },
        { input: '{"root":[5,1,4,null,null,3,6]}', expectedOutput: 'false', isHidden: false },
        { input: '{"root":[1]}', expectedOutput: 'true', isHidden: true },
      ]),
      solution: `function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      solutionExplanation: 'Recursive validation with min/max bounds propagated down.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
    },

    // --- HARD ---
    {
      slug: 'merge-k-sorted-lists',
      title: 'Merge k Sorted Lists',
      description:
        'You are given an array of `k` linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
      difficulty: 'hard',
      category: 'Linked Lists',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Microsoft']),
      tags: JSON.stringify(['linked-list', 'heap', 'divide-and-conquer']),
      constraints: JSON.stringify([
        'k == lists.length',
        '0 <= k <= 10^4',
        '0 <= lists[i].length <= 500',
        '-10^4 <= lists[i][j] <= 10^4',
      ]),
      examples: JSON.stringify([
        { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All three lists merged in sorted order.' },
        { input: 'lists = []', output: '[]', explanation: 'Empty input.' },
      ]),
      hints: JSON.stringify([
        'Use divide and conquer to merge pairs of lists.',
        'Alternatively, use a min-heap to always pick the smallest.',
        'Merge two lists at a time, reducing the problem by half each round.',
        'The divide and conquer approach has O(N log k) complexity.',
      ]),
      testCases: JSON.stringify([
        { input: '{"lists":[[1,4,5],[1,3,4],[2,6]]}', expectedOutput: '[1,1,2,3,4,4,5,6]', isHidden: false },
        { input: '{"lists":[]}', expectedOutput: '[]', isHidden: false },
        { input: '{"lists":[[]]}', expectedOutput: '[]', isHidden: true },
      ]),
      solution: `function mergeKLists(lists) {
  if (!lists.length) return null;
  while (lists.length > 1) {
    const merged = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i], l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(mergeTwoLists(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}`,
      solutionExplanation: 'Divide and conquer: repeatedly merge pairs of lists until one remains.',
      timeComplexity: 'O(N log k)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      description:
        'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
      difficulty: 'hard',
      category: 'Arrays',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Goldman Sachs']),
      tags: JSON.stringify(['array', 'two-pointers', 'stack', 'dp']),
      constraints: JSON.stringify(['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5']),
      examples: JSON.stringify([
        { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of water trapped.' },
        { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of water trapped.' },
      ]),
      hints: JSON.stringify([
        'Water at position i = min(maxLeft, maxRight) - height[i].',
        'Precompute max heights from left and right.',
        'Alternatively, use two pointers moving inward.',
        'The two-pointer approach achieves O(1) extra space.',
      ]),
      testCases: JSON.stringify([
        { input: '{"height":[0,1,0,2,1,0,1,3,2,1,2,1]}', expectedOutput: '6', isHidden: false },
        { input: '{"height":[4,2,0,3,2,5]}', expectedOutput: '9', isHidden: false },
        { input: '{"height":[1,0,1]}', expectedOutput: '1', isHidden: true },
        { input: '{"height":[0]}', expectedOutput: '0', isHidden: true },
      ]),
      solution: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
      solutionExplanation: 'Two pointers from both ends. The lower side determines the water level.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'word-search-ii',
      title: 'Word Search II',
      description:
        'Given an `m x n` board of characters and a list of strings `words`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in a word.',
      difficulty: 'hard',
      category: 'Graphs',
      companies: JSON.stringify(['Amazon', 'Google', 'Microsoft']),
      tags: JSON.stringify(['trie', 'dfs', 'backtracking', 'matrix']),
      constraints: JSON.stringify([
        'm == board.length',
        'n == board[i].length',
        '1 <= m, n <= 12',
        '1 <= words.length <= 3 * 10^4',
        '1 <= words[i].length <= 10',
      ]),
      examples: JSON.stringify([
        {
          input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
          output: '["eat","oath"]',
          explanation: 'Found "eat" and "oath" on the board.',
        },
      ]),
      hints: JSON.stringify([
        'Build a Trie from the word list for efficient prefix checking.',
        'DFS from each cell, following the Trie structure.',
        'Prune branches where no word can be formed.',
        'Remove found words from the Trie to avoid duplicates.',
      ]),
      testCases: JSON.stringify([
        { input: '{"board":[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],"words":["oath","pea","eat","rain"]}', expectedOutput: '["eat","oath"]', isHidden: false },
        { input: '{"board":[["a","b"],["c","d"]],"words":["abcb"]}', expectedOutput: '[]', isHidden: false },
        { input: '{"board":[["a"]],"words":["a"]}', expectedOutput: '["a"]', isHidden: true },
      ]),
      solution: `function findWords(board, words) {
  // Build Trie, DFS with backtracking
  const root = {};
  for (const w of words) {
    let node = root;
    for (const c of w) { if (!node[c]) node[c] = {}; node = node[c]; }
    node.word = w;
  }
  const result = [];
  const m = board.length, n = board[0].length;
  function dfs(i, j, node) {
    if (i < 0 || j < 0 || i >= m || j >= n) return;
    const c = board[i][j];
    if (c === '#' || !node[c]) return;
    node = node[c];
    if (node.word) { result.push(node.word); node.word = null; }
    board[i][j] = '#';
    dfs(i+1,j,node); dfs(i-1,j,node); dfs(i,j+1,node); dfs(i,j-1,node);
    board[i][j] = c;
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root);
  return result;
}`,
      solutionExplanation: 'Trie + DFS backtracking. Build trie from words, search board from each cell.',
      timeComplexity: 'O(m * n * 4^L)',
      spaceComplexity: 'O(W * L)',
    },
    {
      slug: 'longest-increasing-path-in-matrix',
      title: 'Longest Increasing Path in a Matrix',
      description:
        'Given an `m x n` integers matrix, return the length of the longest increasing path. From each cell, you can move in four directions (up, down, left, right). You may not move diagonally or outside the boundary.',
      difficulty: 'hard',
      category: 'Dynamic Programming',
      companies: JSON.stringify(['Google', 'Amazon', 'Meta']),
      tags: JSON.stringify(['dp', 'dfs', 'memoization', 'matrix']),
      constraints: JSON.stringify([
        'm == matrix.length',
        'n == matrix[i].length',
        '1 <= m, n <= 200',
        '0 <= matrix[i][j] <= 2^31 - 1',
      ]),
      examples: JSON.stringify([
        { input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', output: '4', explanation: 'Path: [1, 2, 6, 9]' },
        { input: 'matrix = [[3,4,5],[3,2,6],[2,2,1]]', output: '4', explanation: 'Path: [3, 4, 5, 6]' },
      ]),
      hints: JSON.stringify([
        'Use DFS with memoization.',
        'The memo stores the longest path starting from each cell.',
        'A cell\'s path length depends only on strictly greater neighbors.',
        'No cycles possible (strictly increasing), so no visited tracking needed.',
      ]),
      testCases: JSON.stringify([
        { input: '{"matrix":[[9,9,4],[6,6,8],[2,1,1]]}', expectedOutput: '4', isHidden: false },
        { input: '{"matrix":[[3,4,5],[3,2,6],[2,2,1]]}', expectedOutput: '4', isHidden: false },
        { input: '{"matrix":[[1]]}', expectedOutput: '1', isHidden: true },
      ]),
      solution: `function longestIncreasingPath(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const memo = Array.from({length: m}, () => new Array(n).fill(0));
  function dfs(i, j) {
    if (memo[i][j]) return memo[i][j];
    let max = 1;
    for (const [di, dj] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const ni = i + di, nj = j + dj;
      if (ni >= 0 && nj >= 0 && ni < m && nj < n && matrix[ni][nj] > matrix[i][j]) {
        max = Math.max(max, 1 + dfs(ni, nj));
      }
    }
    return memo[i][j] = max;
  }
  let ans = 0;
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) ans = Math.max(ans, dfs(i, j));
  return ans;
}`,
      solutionExplanation: 'DFS + memoization from each cell. No cycle detection needed since path is strictly increasing.',
      timeComplexity: 'O(m * n)',
      spaceComplexity: 'O(m * n)',
    },
    {
      slug: 'reverse-linked-list',
      title: 'Reverse Linked List',
      description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
      difficulty: 'easy',
      category: 'Linked Lists',
      companies: JSON.stringify(['Amazon', 'Google', 'Microsoft', 'Apple']),
      tags: JSON.stringify(['linked-list']),
      constraints: JSON.stringify(['The number of nodes is in [0, 5000].', '-5000 <= Node.val <= 5000']),
      examples: JSON.stringify([
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed the list.' },
        { input: 'head = [1,2]', output: '[2,1]', explanation: 'Reversed two nodes.' },
      ]),
      hints: JSON.stringify([
        'Use three pointers: prev, curr, next.',
        'Iterate through the list, reversing pointers one by one.',
        'prev starts as null.',
        'At the end, prev is the new head.',
      ]),
      testCases: JSON.stringify([
        { input: '{"head":[1,2,3,4,5]}', expectedOutput: '[5,4,3,2,1]', isHidden: false },
        { input: '{"head":[1,2]}', expectedOutput: '[2,1]', isHidden: false },
        { input: '{"head":[]}', expectedOutput: '[]', isHidden: true },
      ]),
      solution: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      solutionExplanation: 'Iterative approach with three pointers.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
    {
      slug: 'lru-cache',
      title: 'LRU Cache',
      description:
        'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the `LRUCache` class with `get(key)` and `put(key, value)` methods, both running in O(1) time.',
      difficulty: 'medium',
      category: 'Hash Tables',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple']),
      tags: JSON.stringify(['hash-table', 'linked-list', 'design']),
      constraints: JSON.stringify([
        '1 <= capacity <= 3000',
        '0 <= key <= 10^4',
        '0 <= value <= 10^5',
        'At most 2 * 10^5 calls to get and put.',
      ]),
      examples: JSON.stringify([
        {
          input: '["LRUCache","put","put","get","put","get","put","get","get","get"], [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
          output: '[null,null,null,1,null,-1,null,-1,3,4]',
          explanation: 'LRU cache with capacity 2.',
        },
      ]),
      hints: JSON.stringify([
        'Use a hash map for O(1) lookups.',
        'Use a doubly linked list for O(1) insertion/deletion.',
        'Most recently used goes to the front of the list.',
        'When capacity is exceeded, remove from the tail.',
      ]),
      testCases: JSON.stringify([
        { input: '{"ops":["LRUCache","put","put","get","put","get","put","get","get","get"],"args":[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]}', expectedOutput: '[null,null,null,1,null,-1,null,-1,3,4]', isHidden: false },
      ]),
      solution: `class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
  }
}`,
      solutionExplanation: 'JavaScript Map maintains insertion order, enabling O(1) LRU operations.',
      timeComplexity: 'O(1) per operation',
      spaceComplexity: 'O(capacity)',
    },
  ];

  // ==========================================
  // SYSTEM DESIGN PROBLEMS
  // ==========================================

  const systemDesignProblems = [
    {
      slug: 'url-shortener',
      title: 'Design a URL Shortener',
      description:
        'Design a URL shortening service like bit.ly. Users should be able to create short URLs that redirect to the original URL. The system needs to handle high read traffic with low latency.',
      difficulty: 'medium',
      category: 'web_services',
      companies: JSON.stringify(['Google', 'Amazon', 'Meta']),
      tags: JSON.stringify(['hashing', 'database', 'caching', 'scaling']),
      functionalReqs: JSON.stringify([
        'Given a long URL, generate a short URL',
        'Short URL redirects to the original URL',
        'Users can optionally create custom short URLs',
        'URLs expire after a configurable period',
        'Analytics: track click counts per URL',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'High availability (99.9%)',
        'Low latency redirects (< 100ms)',
        'Short URLs should be unpredictable',
        'Scale to 100M URLs, 10K writes/sec, 100K reads/sec',
      ]),
      constraints: JSON.stringify([
        '500M total URLs over 5 years',
        'Read:Write ratio of 10:1',
        'Average URL length: 100 characters',
        'Short URL length: 7 characters',
      ]),
      keyComponents: JSON.stringify([
        'Application servers',
        'Database (SQL or NoSQL)',
        'Cache layer (Redis/Memcached)',
        'Load balancer',
        'URL encoding service',
        'Analytics service',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Requirements Gathering', maxPoints: 15, description: 'Clarified functional and non-functional requirements' },
        { criterion: 'API Design', maxPoints: 10, description: 'Well-defined REST API endpoints' },
        { criterion: 'Data Model', maxPoints: 15, description: 'Appropriate schema design and database choice' },
        { criterion: 'URL Generation', maxPoints: 15, description: 'Encoding strategy (base62, MD5, counter-based)' },
        { criterion: 'Scalability', maxPoints: 20, description: 'Caching, sharding, replication strategies' },
        { criterion: 'High Availability', maxPoints: 15, description: 'Redundancy, failover, load balancing' },
        { criterion: 'Trade-offs', maxPoints: 10, description: 'Discussed trade-offs and alternatives' },
      ]),
      solutionExplanation: 'Key decisions: base62 encoding for short URLs, NoSQL for horizontal scaling, Redis cache for hot URLs, consistent hashing for distribution.',
    },
    {
      slug: 'chat-system',
      title: 'Design a Chat System',
      description:
        'Design a real-time chat application like WhatsApp or Slack. Support one-on-one messaging, group chats, online presence indicators, and message delivery status (sent, delivered, read).',
      difficulty: 'hard',
      category: 'distributed_systems',
      companies: JSON.stringify(['Meta', 'Google', 'Microsoft', 'Slack']),
      tags: JSON.stringify(['websocket', 'messaging', 'real-time', 'scaling']),
      functionalReqs: JSON.stringify([
        'One-on-one messaging',
        'Group chats (up to 500 members)',
        'Online/offline presence indicators',
        'Message delivery status (sent, delivered, read)',
        'Push notifications for offline users',
        'Message history and search',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'Real-time delivery (< 500ms)',
        'Support 50M daily active users',
        'Messages stored persistently',
        'End-to-end encryption',
        'High availability',
      ]),
      constraints: JSON.stringify([
        '50M DAU',
        'Average 40 messages per user per day',
        '2 billion messages per day',
        'Average message size: 100 bytes',
      ]),
      keyComponents: JSON.stringify([
        'WebSocket servers',
        'Message queue (Kafka)',
        'Chat service',
        'Presence service',
        'Notification service',
        'Message storage (Cassandra)',
        'User service',
        'API gateway',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Requirements & Scale', maxPoints: 10, description: 'Clearly defined requirements and scale estimation' },
        { criterion: 'High-Level Design', maxPoints: 15, description: 'Clean architecture with key components' },
        { criterion: 'Real-time Communication', maxPoints: 20, description: 'WebSocket handling, connection management' },
        { criterion: 'Message Storage', maxPoints: 15, description: 'Database choice and message schema' },
        { criterion: 'Group Chat Design', maxPoints: 15, description: 'Fan-out strategies, message routing' },
        { criterion: 'Presence & Notifications', maxPoints: 10, description: 'Online status tracking, push notifications' },
        { criterion: 'Scalability & Reliability', maxPoints: 15, description: 'Horizontal scaling, fault tolerance' },
      ]),
      solutionExplanation: 'WebSocket for real-time, Kafka for reliable message delivery, Cassandra for message storage with time-series optimization, heartbeat-based presence.',
    },
    {
      slug: 'news-feed',
      title: 'Design a News Feed System',
      description:
        'Design a social media news feed like Facebook or Twitter. Users can post content, follow other users, and see a personalized feed of posts from people they follow.',
      difficulty: 'hard',
      category: 'web_services',
      companies: JSON.stringify(['Meta', 'Google', 'Twitter', 'LinkedIn']),
      tags: JSON.stringify(['feed', 'ranking', 'caching', 'fan-out']),
      functionalReqs: JSON.stringify([
        'Users can create posts (text, images, videos)',
        'Users can follow/unfollow other users',
        'News feed shows posts from followed users',
        'Feed is ranked by relevance and recency',
        'Support likes, comments, shares',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'Feed generation < 500ms',
        'Support 300M daily active users',
        'New posts appear in followers\' feeds within seconds',
        'High availability',
      ]),
      constraints: JSON.stringify([
        '300M DAU',
        'Average user follows 200 people',
        'Average 5 posts per user per day',
        'Feed shows top 50 posts',
      ]),
      keyComponents: JSON.stringify([
        'Post service',
        'Feed generation service',
        'Feed cache (Redis)',
        'Fan-out service',
        'Ranking service',
        'Media storage (S3/CDN)',
        'Notification service',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Requirements', maxPoints: 10, description: 'Clear functional and non-functional requirements' },
        { criterion: 'Feed Generation', maxPoints: 25, description: 'Fan-out on write vs fan-out on read trade-off' },
        { criterion: 'Data Model', maxPoints: 15, description: 'Posts, users, follows schema' },
        { criterion: 'Ranking', maxPoints: 15, description: 'Feed ranking algorithm and signals' },
        { criterion: 'Caching Strategy', maxPoints: 15, description: 'Multi-layer caching for feed data' },
        { criterion: 'Media Handling', maxPoints: 10, description: 'Image/video upload and serving' },
        { criterion: 'Scalability', maxPoints: 10, description: 'Handling celebrity users, hot partitions' },
      ]),
      solutionExplanation: 'Hybrid fan-out: write for normal users, read for celebrities. Redis cache for pre-computed feeds. CDN for media delivery.',
    },
    {
      slug: 'rate-limiter',
      title: 'Design a Rate Limiter',
      description:
        'Design a rate limiter that can be used to throttle API requests. It should support different rate limiting strategies and be distributable across multiple servers.',
      difficulty: 'medium',
      category: 'distributed_systems',
      companies: JSON.stringify(['Google', 'Amazon', 'Stripe', 'Cloudflare']),
      tags: JSON.stringify(['rate-limiting', 'distributed', 'algorithms']),
      functionalReqs: JSON.stringify([
        'Limit requests per user/IP/API key',
        'Support different rate limits per API endpoint',
        'Return appropriate HTTP 429 responses',
        'Support multiple algorithms (token bucket, sliding window)',
        'Dashboard for monitoring rate limit metrics',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'Low latency (< 1ms overhead per request)',
        'Distributed across multiple data centers',
        'Highly available',
        'Accurate counting even under high concurrency',
      ]),
      constraints: JSON.stringify([
        '1M requests per second across all endpoints',
        'Must work in distributed environment',
        'Configurable per-user, per-IP, and per-endpoint limits',
      ]),
      keyComponents: JSON.stringify([
        'Rate limiter middleware',
        'Redis cluster for counters',
        'Configuration service',
        'Rules engine',
        'Monitoring & alerting',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Algorithm Selection', maxPoints: 25, description: 'Token bucket, leaky bucket, sliding window, etc.' },
        { criterion: 'Distributed Design', maxPoints: 20, description: 'Handling rate limiting across multiple servers' },
        { criterion: 'Data Storage', maxPoints: 15, description: 'Redis/in-memory counter design' },
        { criterion: 'Configuration', maxPoints: 10, description: 'Flexible rule configuration' },
        { criterion: 'Edge Cases', maxPoints: 15, description: 'Race conditions, clock sync, burst handling' },
        { criterion: 'Monitoring', maxPoints: 15, description: 'Metrics, alerting, and observability' },
      ]),
      solutionExplanation: 'Token bucket algorithm with Redis for distributed counting. Lua scripts for atomic operations. Separate configs per endpoint.',
    },
    {
      slug: 'notification-system',
      title: 'Design a Notification System',
      description:
        'Design a scalable notification system that supports push notifications, SMS, and email. Handle millions of notifications per day with different priorities and delivery guarantees.',
      difficulty: 'medium',
      category: 'distributed_systems',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Uber']),
      tags: JSON.stringify(['messaging', 'queue', 'scaling', 'reliability']),
      functionalReqs: JSON.stringify([
        'Support push notifications (iOS, Android, web)',
        'Support SMS and email channels',
        'Notification templates and personalization',
        'User notification preferences',
        'Rate limiting per user',
        'Priority levels (urgent, normal, low)',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'High throughput (10M+ notifications/day)',
        'Delivery guarantee (at-least-once)',
        'Low latency for high-priority notifications',
        'Extensible to new channels',
      ]),
      constraints: JSON.stringify([
        '10M notifications per day',
        '5M registered devices',
        'Peak: 1K notifications per second',
        'Different SLAs per priority level',
      ]),
      keyComponents: JSON.stringify([
        'Notification service',
        'Message queues (by priority)',
        'Worker services (per channel)',
        'Template engine',
        'User preference store',
        'Third-party integrations (APNs, FCM, Twilio, SendGrid)',
        'Analytics & tracking',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Architecture', maxPoints: 20, description: 'Clean separation of concerns and extensibility' },
        { criterion: 'Queue Design', maxPoints: 20, description: 'Priority queues, retry logic, dead letter queues' },
        { criterion: 'Delivery Guarantees', maxPoints: 15, description: 'At-least-once delivery, idempotency' },
        { criterion: 'Template System', maxPoints: 10, description: 'Personalization and template management' },
        { criterion: 'Rate Limiting', maxPoints: 10, description: 'Per-user and per-channel rate limits' },
        { criterion: 'Monitoring', maxPoints: 10, description: 'Delivery tracking and analytics' },
        { criterion: 'Scalability', maxPoints: 15, description: 'Horizontal scaling of workers' },
      ]),
      solutionExplanation: 'Event-driven architecture with priority message queues. Separate worker pools per channel. Template engine for personalization. Dead letter queues for failed deliveries.',
    },
    {
      slug: 'distributed-cache',
      title: 'Design a Distributed Cache',
      description:
        'Design a distributed caching system like Memcached or Redis. Support high throughput, low latency, and automatic data distribution across multiple nodes.',
      difficulty: 'hard',
      category: 'databases',
      companies: JSON.stringify(['Amazon', 'Google', 'Meta', 'Netflix']),
      tags: JSON.stringify(['caching', 'distributed', 'consistent-hashing', 'replication']),
      functionalReqs: JSON.stringify([
        'GET and SET operations with TTL',
        'Support various data types (string, list, hash)',
        'Automatic data distribution across nodes',
        'Cache eviction (LRU, LFU)',
        'Support atomic operations',
      ]),
      nonFunctionalReqs: JSON.stringify([
        'Sub-millisecond latency',
        'High throughput (1M+ ops/sec)',
        'Horizontal scalability',
        'Fault tolerance (node failure handling)',
        'Data consistency across nodes',
      ]),
      constraints: JSON.stringify([
        'Data fits in memory across the cluster',
        'Node count: 10-1000',
        'Average key-value size: 1KB',
        'Cluster total: 100GB-10TB',
      ]),
      keyComponents: JSON.stringify([
        'Cache nodes',
        'Consistent hashing ring',
        'Client library with routing',
        'Health monitoring',
        'Replication manager',
        'Eviction policy engine',
      ]),
      rubric: JSON.stringify([
        { criterion: 'Data Partitioning', maxPoints: 25, description: 'Consistent hashing and virtual nodes' },
        { criterion: 'Replication', maxPoints: 20, description: 'Data replication strategy for fault tolerance' },
        { criterion: 'Eviction Strategy', maxPoints: 15, description: 'LRU/LFU implementation' },
        { criterion: 'Client Design', maxPoints: 10, description: 'Smart client vs proxy-based routing' },
        { criterion: 'Failure Handling', maxPoints: 15, description: 'Node failure detection and recovery' },
        { criterion: 'Consistency', maxPoints: 15, description: 'Consistency model and trade-offs (CAP)' },
      ]),
      solutionExplanation: 'Consistent hashing with virtual nodes for even distribution. Async replication to replicas. LRU eviction per node. Gossip protocol for failure detection.',
    },
  ];

  // Upsert coding problems
  for (const problem of codingProblems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: problem,
      create: problem,
    });
    console.log(`  Seeded coding problem: ${problem.title}`);
  }

  // Upsert system design problems
  for (const problem of systemDesignProblems) {
    await prisma.systemDesignProblem.upsert({
      where: { slug: problem.slug },
      update: problem,
      create: problem,
    });
    console.log(`  Seeded system design problem: ${problem.title}`);
  }

  console.log(`\nSeeded ${codingProblems.length} coding problems and ${systemDesignProblems.length} system design problems.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
